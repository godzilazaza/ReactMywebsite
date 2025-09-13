<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/config_product.php';
cors();

$method = $_SERVER['REQUEST_METHOD'];

// POST /api/orders.php
// { items: [{code,name,price,qty}], vatRate?: 0.07 }
if ($method === 'POST') {
  $d = read_json();
  $items = $d['items'] ?? [];
  $vatRate = isset($d['vatRate']) ? floatval($d['vatRate']) : 0.07;

  if (!is_array($items) || count($items) === 0) json_out(["error" => "NO_ITEMS"], 400);
  if ($vatRate < 0 || $vatRate > 0.3) json_out(["error" => "INVALID_VAT"], 400);

  $subtotal = 0.0;
  foreach ($items as $it) {
    if (!preg_match('/^\d{13}$/', $it['code'] ?? '')) json_out(["error" => "INVALID_CODE"], 400);
    $qty = intval($it['qty'] ?? 0);
    $price = floatval($it['price'] ?? 0);
    if ($qty <= 0 || $price <= 0) json_out(["error" => "INVALID_ITEM"], 400);
    $subtotal += $qty * $price;
  }
  $vat = round($subtotal * $vatRate, 2);
  $total = $subtotal + $vat;

  try {
    $conn_product->begin_transaction();

    // lock สต็อกสินค้าที่เกี่ยวข้อง
    $codes = array_map(fn($x) => $x['code'], $items);
    $in    = implode(',', array_fill(0, count($codes), '?'));
    $types = str_repeat('s', count($codes));
    $stmt  = $conn_product->prepare("SELECT code, stock FROM products WHERE code IN ($in) FOR UPDATE");
    $stmt->bind_param($types, ...$codes);
    $stmt->execute();
    $res = $stmt->get_result();
    $stockMap = [];
    while ($row = $res->fetch_assoc()) $stockMap[$row['code']] = intval($row['stock']);

    foreach ($items as $it) {
      $cur = $stockMap[$it['code']] ?? 0;
      if ($cur < $it['qty']) {
        $conn_product->rollback();
        json_out(["error" => "STOCK_NOT_ENOUGH", "code" => $it['code']], 400);
      }
    }

    // create order
    $stmt = $conn_product->prepare("INSERT INTO orders (subtotal, vat, total) VALUES (?,?,?)");
    $stmt->bind_param("ddd", $subtotal, $vat, $total);
    $stmt->execute();
    $orderId = $conn_product->insert_id;

    // items + หักสต็อก
    $stmtItem = $conn_product->prepare(
      "INSERT INTO order_items (order_id, product_code, qty, price, line_total) VALUES (?,?,?,?,?)"
    );
    $stmtUpd  = $conn_product->prepare(
      "UPDATE products SET stock = stock - ? WHERE code = ?"
    );

    foreach ($items as $it) {
      $qty = intval($it['qty']); $price = floatval($it['price']);
      $line = $qty * $price;
      $stmtItem->bind_param("isidd", $orderId, $it['code'], $qty, $price, $line);
      $stmtItem->execute();

      $stmtUpd->bind_param("is", $qty, $it['code']);
      $stmtUpd->execute();
    }

    $conn_product->commit();

    json_out([
      "id" => intval($orderId),
      "created_at" => date('c'),
      "subtotal" => $subtotal,
      "vat" => $vat,
      "total" => $total,
      "items" => $items
    ], 201);
  } catch (Throwable $e) {
    if ($conn_product->errno) $conn_product->rollback();
    json_out(["error" => "SERVER_ERROR", "message" => $e->getMessage()], 500);
  }
}

json_out(["error" => "METHOD_NOT_ALLOWED"], 405);