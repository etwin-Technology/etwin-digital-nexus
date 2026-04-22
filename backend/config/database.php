<?php
/**
 * MySQL connection (PDO).
 * Edit credentials to match your local server.
 */

class Database
{
    private $host    = "localhost";
    private $db_name = "etwin_db";
    private $user    = "root";
    private $pass    = "";       // XAMPP/MAMP default is empty
    private $charset = "utf8mb4";

    public function connect()
    {
        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            return new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "error"   => "Database connection failed",
                "details" => $e->getMessage(),
            ]);
            exit;
        }
    }
}
