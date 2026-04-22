<?php
require_once __DIR__ . "/../config/database.php";

$db = (new Database())->connect();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true) ?? [];

$name    = trim($body["name"]    ?? "");
$email   = trim($body["email"]   ?? "");
$subject = trim($body["subject"] ?? "");
$message = trim($body["message"] ?? "");

if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || $subject === "" || $message === "") {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input. All fields required."]);
    exit;
}

try {
    $stmt = $db->prepare("
        INSERT INTO contact_messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$name, $email, $subject, $message]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "id"      => (int) $db->lastInsertId(),
        "message" => "Thanks! We'll be in touch shortly.",
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
