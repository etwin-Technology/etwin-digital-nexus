<?php
require_once __DIR__ . "/../config/database.php";

$db = (new Database())->connect();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$body = json_decode(file_get_contents("php://input"), true) ?? [];

$serviceId = trim($body["service_id"] ?? "");
$name      = trim($body["name"]       ?? "");
$email     = trim($body["email"]      ?? "");
$budget    = trim($body["budget"]     ?? "");
$message   = trim($body["message"]    ?? "");

if ($serviceId === "" || $name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input. Required: service_id, name, email."]);
    exit;
}

try {
    $stmt = $db->prepare("
        INSERT INTO service_requests (service_id, name, email, budget, message)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$serviceId, $name, $email, $budget, $message]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "id"      => (int) $db->lastInsertId(),
        "message" => "Service request received. We'll contact you shortly.",
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
