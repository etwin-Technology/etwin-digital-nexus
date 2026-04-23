<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db = (new Database())->connect();

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit;
}

require_admin();

try {
    $stats = [
        "products"          => (int) $db->query("SELECT COUNT(*) FROM products")->fetchColumn(),
        "digital_products"  => (int) $db->query("SELECT COUNT(*) FROM digital_products")->fetchColumn(),
        "services"          => (int) $db->query("SELECT COUNT(*) FROM services")->fetchColumn(),
        "orders"            => (int) $db->query("SELECT COUNT(*) FROM orders")->fetchColumn(),
        "orders_pending"    => (int) $db->query("SELECT COUNT(*) FROM orders WHERE status='pending'")->fetchColumn(),
        "revenue"           => (float) $db->query("SELECT COALESCE(SUM(total),0) FROM orders WHERE status<>'cancelled'")->fetchColumn(),
        "messages_unread"   => (int) $db->query("SELECT COUNT(*) FROM contact_messages WHERE is_read=0")->fetchColumn(),
        "requests_unread"   => (int) $db->query("SELECT COUNT(*) FROM service_requests WHERE is_read=0")->fetchColumn(),
    ];

    // last 7 days revenue
    $rev = $db->query("
        SELECT DATE(created_at) AS day, COALESCE(SUM(total),0) AS total
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY day ASC
    ")->fetchAll();

    $recent = $db->query("
        SELECT id, customer_name, total, status, created_at
        FROM orders
        ORDER BY created_at DESC
        LIMIT 5
    ")->fetchAll();

    echo json_encode([
        "stats"          => $stats,
        "revenue_chart"  => $rev,
        "recent_orders"  => $recent,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
