<?php
/**
 * Upload endpoint
 *  POST /api/uploads        -> multipart with field "file" (image)
 *  POST /api/uploads?type=digital -> any file (zip, pdf, etc.)
 *  DELETE /api/uploads?path=uploads/xxx.jpg
 *
 * Returns: { url: "/backend/uploads/<file>", path: "uploads/<file>", size, type }
 */
require_once __DIR__ . "/../config/auth.php";

// Replace JSON header with proper one (cors.php sets JSON for all)
header_remove("Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_admin();

$method = $_SERVER["REQUEST_METHOD"];

$uploadsDir = realpath(__DIR__ . "/..") . "/uploads";
if (!is_dir($uploadsDir)) {
    @mkdir($uploadsDir, 0775, true);
}

$type = $_GET["type"] ?? "image"; // "image" or "digital"

$imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
$digitalMimes = array_merge($imageMimes, [
    "application/zip", "application/x-zip-compressed", "application/octet-stream",
    "application/pdf", "application/x-rar-compressed", "application/x-7z-compressed",
    "application/x-tar", "application/gzip", "text/plain", "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

try {
    if ($method === "DELETE") {
        $rel = trim($_GET["path"] ?? "", "/");
        if ($rel === "" || strpos($rel, "uploads/") !== 0 || strpos($rel, "..") !== false) {
            http_response_code(400); echo json_encode(["error" => "Invalid path"]); exit;
        }
        $abs = realpath(__DIR__ . "/../" . $rel);
        if ($abs && strpos($abs, $uploadsDir) === 0 && is_file($abs)) {
            @unlink($abs);
        }
        echo json_encode(["success" => true]);
        exit;
    }

    if ($method !== "POST") {
        http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit;
    }

    if (empty($_FILES["file"]) || $_FILES["file"]["error"] !== UPLOAD_ERR_OK) {
        $err = $_FILES["file"]["error"] ?? "no file";
        http_response_code(400);
        echo json_encode(["error" => "Upload failed (code $err). Check upload_max_filesize."]);
        exit;
    }

    $file = $_FILES["file"];
    $maxSize = $type === "digital" ? 100 * 1024 * 1024 : 8 * 1024 * 1024; // 100MB / 8MB
    if ($file["size"] > $maxSize) {
        http_response_code(413); echo json_encode(["error" => "File too large"]); exit;
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime  = $finfo->file($file["tmp_name"]);
    $allowed = $type === "digital" ? $digitalMimes : $imageMimes;
    if (!in_array($mime, $allowed, true)) {
        http_response_code(415);
        echo json_encode(["error" => "Unsupported file type: $mime"]);
        exit;
    }

    $orig = $file["name"];
    $ext  = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
    if ($ext === "" || strlen($ext) > 8) $ext = "bin";
    $safe = preg_replace('/[^a-z0-9_-]/i', "-", pathinfo($orig, PATHINFO_FILENAME));
    $safe = substr($safe ?: "file", 0, 40);

    $name = $safe . "-" . bin2hex(random_bytes(6)) . "." . $ext;
    $dest = $uploadsDir . "/" . $name;

    if (!move_uploaded_file($file["tmp_name"], $dest)) {
        http_response_code(500); echo json_encode(["error" => "Could not save file"]); exit;
    }
    @chmod($dest, 0644);

    // Build a public URL relative to the backend folder
    $scriptDir = rtrim(str_replace("\\", "/", dirname($_SERVER["SCRIPT_NAME"])), "/");
    $base = preg_replace('#/api$#', "", $scriptDir); // .../backend
    $url  = $base . "/uploads/" . $name;

    echo json_encode([
        "success" => true,
        "url"     => $url,
        "path"    => "uploads/" . $name,
        "name"    => $orig,
        "size"    => (int) $file["size"],
        "type"    => $mime,
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
