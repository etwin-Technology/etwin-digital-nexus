<?php
/**
 * Front controller — routes /api/* to the matching handler.
 *
 * Public:
 *   GET  /api/products              GET /api/products/{id}
 *   GET  /api/digital-products      GET /api/digital-products/{id}
 *   GET  /api/services              GET /api/services/{id}
 *   POST /api/services/request
 *   POST /api/orders                (checkout)
 *   POST /api/contact
 *
 * Admin (session required):
 *   POST /api/admin/login           POST /api/admin/logout      GET /api/admin/me
 *   POST/PUT/DELETE /api/products/{id}
 *   POST/PUT/DELETE /api/digital-products/{id}
 *   POST/PUT/DELETE /api/services/{id}
 *   GET/PUT/DELETE  /api/orders/{id}
 *   GET/PUT/DELETE  /api/messages/{id}
 *   GET/PUT/DELETE  /api/requests/{id}
 *   GET             /api/stats
 */

require_once __DIR__ . "/config/cors.php";

$base = rtrim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
$uri  = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
if ($base && strpos($uri, $base) === 0) {
    $uri = substr($uri, strlen($base));
}
$uri = trim($uri, "/");
$segments = $uri === "" ? [] : explode("/", $uri);

if (isset($segments[0]) && $segments[0] === "api") array_shift($segments);

$resource = $segments[0] ?? "";
$param    = $segments[1] ?? null;
$action   = $segments[2] ?? null;

switch ($resource) {
    case "":
        echo json_encode([
            "name"    => "eTwin API",
            "version" => "2.0",
        ], JSON_PRETTY_PRINT);
        break;

    case "admin":
        // /api/admin/{action}
        $_GET["action"] = $param;
        require __DIR__ . "/api/admin-auth.php";
        break;

    case "stats":
        require __DIR__ . "/api/stats.php";
        break;

    case "products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/products.php";
        break;

    case "digital-products":
        $_GET["id"] = $param;
        require __DIR__ . "/api/digital-products.php";
        break;

    case "services":
        if ($param === "request") {
            require __DIR__ . "/api/service-request.php";
        } else {
            $_GET["id"] = $param;
            require __DIR__ . "/api/services.php";
        }
        break;

    case "orders":
        $_GET["id"] = $param;
        require __DIR__ . "/api/orders.php";
        break;

    case "messages":
        $_GET["id"] = $param;
        require __DIR__ . "/api/messages.php";
        break;

    case "requests":
        $_GET["id"] = $param;
        require __DIR__ . "/api/requests.php";
        break;

    case "contact":
        require __DIR__ . "/api/contact.php";
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found: /$uri"]);
}
