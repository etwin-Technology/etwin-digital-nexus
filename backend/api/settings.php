<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];

try {
    if ($method === "GET") {
        // Public read — returns whitelisted public-safe settings
        $rows = $db->query("SELECT setting_key, setting_value FROM settings")->fetchAll();
        $out = [];
        foreach ($rows as $r) $out[$r["setting_key"]] = $r["setting_value"];

        // If not admin, only return public keys
        if (!is_admin()) {
            $public = ["store_name", "whatsapp_number", "contact_email", "currency"];
            $out = array_intersect_key($out, array_flip($public));
        }
        echo json_encode($out);
        exit;
    }

    require_admin();

    if ($method === "PUT" || $method === "POST") {
        $body = json_decode(file_get_contents("php://input"), true) ?? [];
        if (!is_array($body)) {
            http_response_code(400); echo json_encode(["error" => "Invalid body"]); exit;
        }
        $stmt = $db->prepare("
            INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)
            ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
        ");
        foreach ($body as $key => $value) {
            if (!preg_match('/^[a-z0-9_]{1,64}$/i', $key)) continue;
            $stmt->execute([$key, (string) $value]);
        }
        echo json_encode(["success" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
