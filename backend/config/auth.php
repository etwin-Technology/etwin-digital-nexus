<?php
/**
 * Simple session-based admin auth.
 * Login via POST /api/admin/login -> sets PHP session.
 * Protected endpoints call require_admin() which returns 401 if not logged in.
 */

if (session_status() === PHP_SESSION_NONE) {
    // Allow cookie session over CORS for local dev
    session_set_cookie_params([
        "lifetime" => 0,
        "path"     => "/",
        "secure"   => false,
        "httponly" => true,
        "samesite" => "Lax",
    ]);
    session_start();
}

function is_admin(): bool {
    return !empty($_SESSION["admin_id"]);
}

function current_admin(): ?array {
    if (!is_admin()) return null;
    return [
        "id"       => $_SESSION["admin_id"],
        "username" => $_SESSION["admin_username"] ?? "",
        "name"     => $_SESSION["admin_name"] ?? "",
    ];
}

function require_admin(): void {
    if (!is_admin()) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized. Admin login required."]);
        exit;
    }
}
