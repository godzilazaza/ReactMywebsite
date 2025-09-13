<?php
// ================== CORS & Preflight ==================
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
  'http://localhost:5173',          // dev (Vite)
  'http://localhost:3000',          // dev (CRA)
  'https://weerispost.online',      // main domain
  'https://www.weerispost.online',  // www domain
];
if (in_array($origin, $allowed, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
} else {
  header("Access-Control-Allow-Origin: *"); // dev เท่านั้น, prod ควรล็อก
}
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204); // preflight OK
  exit;
}

// ================== Always JSON ==================
header('Content-Type: application/json; charset=utf-8');

require_once 'db.php';
$conn->set_charset('utf8mb4');

// ================== Validate method ==================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["success"=>false,"message"=>"Method not allowed"]);
  exit;
}

// ================== Parse input ==================
$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
  http_response_code(400);
  echo json_encode(["success"=>false,"message"=>"Invalid JSON"]);
  exit;
}

$username = isset($data["username"]) ? trim($data["username"]) : null; // อาจจะเป็น email ได้
$password = isset($data["password"]) ? (string)$data["password"] : null;

if (!$username || !$password) {
  http_response_code(400);
  echo json_encode(["success"=>false,"message"=>"Missing username/email or password"]);
  exit;
}

// ================== Lookup user ==================
$stmt = $conn->prepare("SELECT * FROM users WHERE username=? OR email=? LIMIT 1");
if (!$stmt) {
  http_response_code(500);
  echo json_encode(["success"=>false,"message"=>"Prepare failed","error"=>$conn->error]);
  exit;
}
$stmt->bind_param("ss", $username, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
  echo json_encode(["success"=>false,"message"=>"User not found"]);
  exit;
}

$user = $result->fetch_assoc();

// ================== Verify password ==================
if (password_verify($password, $user["password"])) {
  echo json_encode([
    "success" => true,
    "message" => "Login success",
    "user" => [
      "id"       => $user["id"],
      "username" => $user["username"],
      "email"    => $user["email"]
    ]
  ]);
} else {
  echo json_encode(["success"=>false,"message"=>"Invalid password"]);
}