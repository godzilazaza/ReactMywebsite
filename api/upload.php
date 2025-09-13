<?php
// api/upload.php
// เปิดใช้ CORS ตามโดเมนที่เรียกใช้งาน
header("Access-Control-Allow-Origin: https://weerispost.online"); // ปรับให้ตรงโดเมนที่เรียกจริง
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$uploadDir = __DIR__ . '/../uploads/'; // โฟลเดอร์เก็บไฟล์ (อยู่นอก api จะดี)
$baseUrl   = 'https://weerispost.online/uploads/'; // URL ตรงไปยังโฟลเดอร์นั้น

if (!is_dir($uploadDir)) {
  @mkdir($uploadDir, 0755, true);
}

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(['error' => 'NO_FILE']);
  exit;
}

$f = $_FILES['file'];

// ตรวจขนาด (≤ 2MB)
$maxSize = 2 * 1024 * 1024;
if ($f['size'] > $maxSize) {
  http_response_code(400);
  echo json_encode(['error' => 'FILE_TOO_LARGE', 'message' => 'Max 2MB']);
  exit;
}

// ตรวจชนิดไฟล์แบบหยาบ
$allowed = ['image/jpeg' => '.jpg', 'image/png' => '.png', 'image/webp' => '.webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $f['tmp_name']);
finfo_close($finfo);
if (!isset($allowed[$mime])) {
  http_response_code(400);
  echo json_encode(['error' => 'INVALID_TYPE', 'message' => 'Allow jpg/png/webp']);
  exit;
}

// ตั้งชื่อไฟล์ให้ unique
$ext = $allowed[$mime];
$basename = 'p_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . $ext;
$target = $uploadDir . $basename;

// ย้ายไฟล์
if (!move_uploaded_file($f['tmp_name'], $target)) {
  http_response_code(500);
  echo json_encode(['error' => 'MOVE_FAILED']);
  exit;
}

echo json_encode([
  'ok' => true,
  'url' => $baseUrl . $basename
]);