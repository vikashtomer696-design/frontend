<?php
declare(strict_types=1);
namespace StreamVision\Core;

final class Jwt {
    public function __construct(private string $secret) {}

    public function issue(array $claims, int $ttlSeconds = 86400): string {
        $header = $this->b64(['alg' => 'HS256', 'typ' => 'JWT']);
        $payload = $this->b64($claims + ['iat' => time(), 'exp' => time() + $ttlSeconds]);
        $signature = $this->sign("$header.$payload");
        return "$header.$payload.$signature";
    }

    public function requireUser(): array {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!str_starts_with($header, 'Bearer ')) Response::json(['error' => 'Unauthorized'], 401);
        [$h, $p, $s] = explode('.', substr($header, 7)) + [null, null, null];
        if (!$h || !$p || !$s || !hash_equals($this->sign("$h.$p"), $s)) Response::json(['error' => 'Unauthorized'], 401);
        $claims = json_decode(base64_decode(strtr($p, '-_', '+/')), true) ?: [];
        if (($claims['exp'] ?? 0) < time()) Response::json(['error' => 'Token expired'], 401);
        return $claims;
    }

    private function b64(array $data): string { return rtrim(strtr(base64_encode(json_encode($data, JSON_THROW_ON_ERROR)), '+/', '-_'), '='); }
    private function sign(string $value): string { return rtrim(strtr(base64_encode(hash_hmac('sha256', $value, $this->secret, true)), '+/', '-_'), '='); }
}
