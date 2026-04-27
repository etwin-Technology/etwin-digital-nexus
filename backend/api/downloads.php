<?php
/**
 * Download flow:
 *  GET  /api/downloads?token=XXX   -> stream the file (one-time-ish, counted)
 *  POST /api/downloads             -> body { product_id, email? } -> creates token if eligible
 *                                      (free product OR latest paid order with that email contains it)
 */
require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../config/auth.php";

$db     = (new Database())->connect();
$method = $_SERVER["REQUEST_METHOD"];

function streamFile(string $absPath, string $downloadName): void {
    if (!is_file($absPath)) {
        http_response_code(404); echo json_encode(["error" => "File missing on server"]); exit;
    }
    // Replace JSON header
    header_remove("Content-Type");
    header("Content-Description: File Transfer");
    header("Content-Type: application/octet-stream");
    header('Content-Disposition: attachment; filename="' . addslashes($downloadName) . '"');
    header("Expires: 0");
    header("Cache-Control: must-revalidate");
    header("Pragma: public");
    header("Content-Length: " . filesize($absPath));
    while (ob_get_level() > 0) ob_end_clean();
    readfile($absPath);
    exit;
}

function resolveAbsoluteFromRelative(string $rel): ?string {
    $rel = ltrim($rel, "/");
    if (str_starts_with($rel, "uploads/")) {
        $abs = realpath(__DIR__ . "/../" . $rel);
        $base = realpath(__DIR__ . "/../uploads");
        if ($abs && $base && strpos($abs, $base) === 0) return $abs;
    }
    return null;
}

try {
    if ($method === "GET") {
        $token = trim($_GET["token"] ?? "");
        if ($token === "") { http_response_code(400); echo json_encode(["error" => "token required"]); exit; }

        $stmt = $db->prepare("SELECT * FROM download_tokens WHERE token = ?");
        $stmt->execute([$token]);
        $t = $stmt->fetch();
        if (!$t) { http_response_code(404); echo json_encode(["error" => "Invalid token"]); exit; }

        if ($t["expires_at"] && strtotime($t["expires_at"]) < time()) {
            http_response_code(410); echo json_encode(["error" => "Token expired"]); exit;
        }
        if ((int) $t["downloads"] >= (int) $t["max_downloads"]) {
            http_response_code(429); echo json_encode(["error" => "Download limit reached"]); exit;
        }

        $p = $db->prepare("SELECT * FROM digital_products WHERE id = ?");
        $p->execute([$t["product_id"]]);
        $product = $p->fetch();
        if (!$product) { http_response_code(404); echo json_encode(["error" => "Product missing"]); exit; }

        // Find a deliverable: file_path (local) > download_url (remote)
        if (!empty($product["file_path"])) {
            $abs = resolveAbsoluteFromRelative($product["file_path"]);
            if (!$abs) { http_response_code(404); echo json_encode(["error" => "File not found"]); exit; }

            $db->prepare("UPDATE download_tokens SET downloads = downloads + 1 WHERE id = ?")->execute([$t["id"]]);
            $name = $product["id"] . "." . pathinfo($abs, PATHINFO_EXTENSION);
            streamFile($abs, $name);
        }

        if (!empty($product["download_url"])) {
            $db->prepare("UPDATE download_tokens SET downloads = downloads + 1 WHERE id = ?")->execute([$t["id"]]);
            header_remove("Content-Type");
            header("Location: " . $product["download_url"]);
            exit;
        }

        http_response_code(404);
        echo json_encode(["error" => "No file attached to this product yet"]);
        exit;
    }

    if ($method === "POST") {
        $body = json_decode(file_get_contents("php://input"), true) ?? [];
        $productId = trim($body["product_id"] ?? "");
        $email     = trim($body["email"] ?? "");
        $orderId   = isset($body["order_id"]) ? (int) $body["order_id"] : null;

        if ($productId === "") {
            http_response_code(400); echo json_encode(["error" => "product_id required"]); exit;
        }

        $stmt = $db->prepare("SELECT * FROM digital_products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        if (!$product) { http_response_code(404); echo json_encode(["error" => "Product not found"]); exit; }

        $isFree   = (int) $product["is_free"] === 1 || (float) $product["price"] === 0.0;
        $eligible = $isFree || is_admin();

        // Paid: needs an order with status paid/completed/shipped containing this product
        if (!$eligible && $orderId) {
            $check = $db->prepare("
                SELECT o.id FROM orders o
                JOIN order_items i ON i.order_id = o.id
                WHERE o.id = ?
                  AND o.status IN ('paid','completed','shipped')
                  AND i.product_id = ?
                  AND (? = '' OR LOWER(o.customer_email) = LOWER(?))
                LIMIT 1
            ");
            $check->execute([$orderId, $productId, $email, $email]);
            if ($check->fetchColumn()) $eligible = true;
        }

        // Or: most recent paid order from this email contains the product
        if (!$eligible && $email !== "") {
            $check = $db->prepare("
                SELECT o.id FROM orders o
                JOIN order_items i ON i.order_id = o.id
                WHERE LOWER(o.customer_email) = LOWER(?)
                  AND o.status IN ('paid','completed','shipped')
                  AND i.product_id = ?
                ORDER BY o.created_at DESC
                LIMIT 1
            ");
            $check->execute([$email, $productId]);
            $row = $check->fetch();
            if ($row) { $eligible = true; $orderId = (int) $row["id"]; }
        }

        if (!$eligible) {
            http_response_code(403);
            echo json_encode(["error" => "Not eligible — payment not confirmed yet."]);
            exit;
        }

        // Create the token (1 day, 5 downloads for paid; 30 days, 50 for free)
        $token = bin2hex(random_bytes(24));
        $maxDl = $isFree ? 50 : 5;
        $exp   = $isFree ? "+30 days" : "+24 hours";
        $expires = (new DateTime("now", new DateTimeZone("UTC")))->modify($exp)->format("Y-m-d H:i:s");

        $ins = $db->prepare("
            INSERT INTO download_tokens (token, order_id, product_id, email, max_downloads, expires_at)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $ins->execute([$token, $orderId, $productId, $email ?: null, $maxDl, $expires]);

        // Build URL
        $scriptDir = rtrim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
        $url = $scriptDir . "/downloads?token=" . $token;
        // dirname of /backend/api/index.php is /backend/api -> good, "/downloads" routes to this file

        echo json_encode([
            "success"     => true,
            "token"       => $token,
            "url"         => $url,
            "expires_at"  => $expires,
            "is_free"     => $isFree,
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
