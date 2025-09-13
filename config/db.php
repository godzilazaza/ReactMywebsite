<?php
$host = "localhost";
$user = "weeris_demo";       // username จาก phpMyAdmin
$pass = "weeris02";        // password จาก phpMyAdmin
$dbname = "weeris_demoApp";  // database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>