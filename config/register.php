<?php
// ================== CORS & Preflight ==================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',          // Vite dev
  'http://localhost:3000',          // CRA dev
  'https://weerispost.online',      // โดเมนหลัก
  'https://www.weerispost.online',  // ถ้ามี www
];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
} else {
  // ถ้าจะล็อกเข้มขึ้น ให้ลบบรรทัดนี้ออก
  header("Access-Control-Allow-Origin: *");
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// ================== Always JSON response ==================
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';
if (method_exists($conn, 'set_charset')) { $conn->set_charset('utf8mb4'); }

// ================== Method & Payload ==================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["success"=>false, "message"=>"Method not allowed"]);
  exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["success"=>false, "message"=>"Invalid JSON"]);
  exit;
}

// ================== Validate inputs ==================
$username = isset($data['username']) ? trim($data['username']) : null;
$email    = isset($data['email'])    ? trim($data['email'])    : null;
$passRaw  = isset($data['password']) ? (string)$data['password'] : null;

if (!$username || !$email || !$passRaw) {
  http_response_code(400);
  echo json_encode(["success"=>false, "message"=>"Missing fields"]);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["success"=>false, "message"=>"Invalid email"]);
  exit;
}

$password = password_hash($passRaw, PASSWORD_BCRYPT);

// ================== Uniqueness checks ==================
$st1 = $conn->prepare("SELECT 1 FROM users WHERE username=? LIMIT 1");
if (!$st1) { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Prepare failed","error"=>$conn->error]); exit; }
$st1->bind_param("s", $username);
$st1->execute(); $st1->store_result();
if ($st1->num_rows > 0) { echo json_encode(["success"=>false,"message"=>"Username already exists"]); exit; }

$st2 = $conn->prepare("SELECT 1 FROM users WHERE email=? LIMIT 1");
if (!$st2) { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Prepare failed","error"=>$conn->error]); exit; }
$st2->bind_param("s", $email);
$st2->execute(); $st2->store_result();
if ($st2->num_rows > 0) { echo json_encode(["success"=>false,"message"=>"Email already exists"]); exit; }

// ================== Insert user ==================
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
if (!$stmt) { http_response_code(500); echo json_encode(["success"=>false,"message"=>"Prepare failed","error"=>$conn->error]); exit; }
$stmt->bind_param("sss", $username, $email, $password);

if ($stmt->execute()) {
  echo json_encode([
    "success" => true,
    "message" => "Register success",
    "user_id" => $conn->insert_id
  ]);
} else {
  // ถ้าตั้ง UNIQUE index ไว้ จะได้ errno 1062
  if ($conn->errno === 1062) {
    $err = $conn->error;
    $msg = (stripos($err, 'username') !== false) ? 'Username already exists'
         : ((stripos($err, 'email') !== false) ? 'Email already exists' : 'Duplicate entry');
    echo json_encode(["success"=>false, "message"=>$msg]);
  } else {
    http_response_code(500);
    echo json_encode(["success"=>false, "message"=>"Register failed", "error"=>$conn->error]);
  }
}