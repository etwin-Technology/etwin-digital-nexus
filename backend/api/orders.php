<?php
require_once __DIR__ . "/../config/database.php";

$db = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id = $_GET["id"] ?? null;

try {
    if ($method === "GET") {
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) {
                http_response_code(404);
                echo json_encode(["error" => "Order not found"]);
                exit;
            }
            $items = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $items->execute([$id]);
            $order["items"] = $items->fetchAll();
            echo json_encode($order);
        } else {
            $stmt = $db->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }

    if ($method === "POST") {
        $body = json_decode(file_get_contents("php://input"), true) ?? [];

        $name    = trim($body["customer_name"]  ?? "");
        $email   = trim($body["customer_email"] ?? "");
        $phone   = trim($body["customer_phone"] ?? "");
        $address = trim($body["address"]        ?? "");
        $items   = $body["items"] ?? [];

        if ($name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || !is_array($items) || count($items) === 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input. Required: customer_name, customer_email, items[]"]);
            exit;
        }

        $subtotal = 0.0;
        foreach ($items as $it) {
            $subtotal += ((float) ($it["unit_price"] ?? 0)) * ((int) ($it["quantity"] ?? 0));
        }
        $shipping = $subtotal > 500 ? 0 : 19;
        $tax = round($subtotal * 0.08, 2);
        $total = round($subtotal + $shipping + $tax, 2);

        $db->beginTransaction();
        $stmt = $db->prepare("
            INSERT INTO orders (customer_name, customer_email, customer_phone, address, subtotal, shipping, tax, total)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $email, $phone, $address, $subtotal, $shipping, $tax, $total]);
        $orderId = (int) $db->lastInsertId();

        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity)
            VALUES (?, ?, ?, ?, ?)
        ");
        foreach ($items as $it) {
            $itemStmt->execute([
                $orderId,
                $it["product_id"]   ?? "",
                $it["product_name"] ?? "",
                (float) ($it["unit_price"] ?? 0),
                (int) ($it["quantity"] ?? 1),
            ]);
        }
        $db->commit();

        http_response_code(201);
        echo json_encode([
            "success"  => true,
            "order_id" => $orderId,
            "total"    => $total,
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
