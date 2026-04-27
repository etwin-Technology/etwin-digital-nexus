<?php
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];
$id     = $_GET["id"] ?? null;

try {
    if ($method === "GET") {
        require_admin();
        if ($id) {
            $stmt = $db->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            if (!$order) { http_response_code(404); echo json_encode(["error" => "Order not found"]); exit; }
            $items = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $items->execute([$id]);
            $order["items"] = $items->fetchAll();
            echo json_encode($order);
        } else {
            $stmt = $db->query("
                SELECT o.*, COUNT(oi.id) AS item_count
                FROM orders o
                LEFT JOIN order_items oi ON oi.order_id = o.id
                GROUP BY o.id
                ORDER BY o.created_at DESC
                LIMIT 200
            ");
            echo json_encode($stmt->fetchAll());
        }
        exit;
    }

    if ($method === "POST") {
        // Public: customers create orders during checkout
        $body = json_decode(file_get_contents("php://input"), true) ?? [];
        $name    = trim($body["customer_name"]  ?? "");
        $email   = trim($body["customer_email"] ?? "");
        $phone   = trim($body["customer_phone"] ?? "");
        $address = trim($body["address"]        ?? "");
        $items   = $body["items"] ?? [];

        if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL) || !is_array($items) || count($items) === 0) {
            http_response_code(400);
            echo json_encode(["error" => "Invalid input. Required: customer_name, customer_email, items[]"]);
            exit;
        }

        // Resolve which items are digital
        $ids = array_values(array_filter(array_map(fn($i) => (string) ($i["product_id"] ?? ""), $items)));
        $digitalIds = [];
        if (count($ids)) {
            $place = implode(",", array_fill(0, count($ids), "?"));
            $st = $db->prepare("SELECT id FROM digital_products WHERE id IN ($place)");
            $st->execute($ids);
            $digitalIds = array_column($st->fetchAll(), "id");
        }

        $subtotal = 0.0;
        $hasPhysical = false;
        foreach ($items as $it) {
            $subtotal += ((float) ($it["unit_price"] ?? 0)) * ((int) ($it["quantity"] ?? 0));
            if (!in_array($it["product_id"] ?? "", $digitalIds, true)) $hasPhysical = true;
        }

        // settings-driven shipping/tax
        $cfg = [];
        foreach ($db->query("SELECT setting_key, setting_value FROM settings")->fetchAll() as $r) {
            $cfg[$r["setting_key"]] = $r["setting_value"];
        }
        $flatShipping = (float) ($cfg["shipping_flat"] ?? 19);
        $freeOver     = (float) ($cfg["free_shipping_over"] ?? 500);
        $taxRate      = (float) ($cfg["tax_rate"] ?? 0.08);

        $shipping = !$hasPhysical ? 0 : ($subtotal > $freeOver ? 0 : $flatShipping);
        $tax      = round($subtotal * $taxRate, 2);
        $total    = round($subtotal + $shipping + $tax, 2);

        $db->beginTransaction();
        $stmt = $db->prepare("
            INSERT INTO orders (customer_name, customer_email, customer_phone, address, subtotal, shipping, tax, total, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name, $email, $phone, $address,
            $subtotal, $shipping, $tax, $total,
            (string) ($body["notes"] ?? ""),
        ]);
        $orderId = (int) $db->lastInsertId();

        $itemStmt = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, is_digital)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        foreach ($items as $it) {
            $pid = (string) ($it["product_id"] ?? "");
            $itemStmt->execute([
                $orderId, $pid,
                (string) ($it["product_name"] ?? ""),
                (float) ($it["unit_price"] ?? 0),
                (int) ($it["quantity"] ?? 1),
                in_array($pid, $digitalIds, true) ? 1 : 0,
            ]);
        }
        $db->commit();

        http_response_code(201);
        echo json_encode([
            "success"      => true,
            "order_id"     => $orderId,
            "total"        => $total,
            "has_digital"  => count($digitalIds) > 0,
        ]);
        exit;
    }

    if ($method === "PUT") {
        require_admin();
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $body = json_decode(file_get_contents("php://input"), true) ?? [];
        $stmt = $db->prepare("UPDATE orders SET status = ?, notes = COALESCE(?, notes) WHERE id = ?");
        $stmt->execute([
            (string) ($body["status"] ?? "pending"),
            $body["notes"] ?? null,
            $id,
        ]);
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method === "DELETE") {
        require_admin();
        if (!$id) { http_response_code(400); echo json_encode(["error" => "id required"]); exit; }
        $db->prepare("DELETE FROM orders WHERE id = ?")->execute([$id]);
        echo json_encode(["success" => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    if ($db->inTransaction()) $db->rollBack();
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
