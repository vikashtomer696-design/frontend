<?php
declare(strict_types=1);
namespace StreamVision\Core;
use PDO;

final class Database {
    public static function connect(): PDO {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $_ENV['DB_HOST'] ?? '127.0.0.1', $_ENV['DB_NAME'] ?? 'streamvision');
        return new PDO($dsn, $_ENV['DB_USER'] ?? 'streamvision', $_ENV['DB_PASS'] ?? '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
}
