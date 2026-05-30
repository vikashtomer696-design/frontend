<?php
declare(strict_types=1);
namespace StreamVision\Core;

final class Response {
    public static function json(array $payload, int $status = 200): never {
        http_response_code($status);
        echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        exit;
    }
}
