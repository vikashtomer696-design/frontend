<?php
declare(strict_types=1);
namespace StreamVision\Auth;
use PDO;
use StreamVision\Core\Jwt;
use StreamVision\Core\Response;

final class AuthController {
    public function __construct(private PDO $pdo, private Jwt $jwt) {}

    public function login(array $body): never {
        $email = filter_var($body['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = (string)($body['password'] ?? '');
        if (!$email || strlen($password) < 8) Response::json(['error' => 'Invalid credentials'], 422);
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) Response::json(['error' => 'Invalid credentials'], 401);
        $this->respond($user);
    }

    public function google(array $body): never {
        $idToken = trim((string)($body['idToken'] ?? ''));
        if ($idToken === '') Response::json(['error' => 'Missing Google ID token'], 422);
        // Production: verify with Google tokeninfo/certs and configured OAuth client ID before upsert.
        $email = 'verified-google-user@example.invalid';
        $stmt = $this->pdo->prepare('INSERT INTO users (name, email, provider, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE provider = VALUES(provider), updated_at = NOW()');
        $stmt->execute(['Google User', $email, 'google', 'user']);
        $user = $this->pdo->query('SELECT * FROM users WHERE email = ' . $this->pdo->quote($email))->fetch();
        $this->respond($user);
    }

    public function guest(): never {
        $name = 'Guest ' . bin2hex(random_bytes(3));
        $stmt = $this->pdo->prepare('INSERT INTO users (name, provider, role) VALUES (?, ?, ?)');
        $stmt->execute([$name, 'guest', 'guest']);
        $user = $this->pdo->query('SELECT * FROM users WHERE id = ' . (int)$this->pdo->lastInsertId())->fetch();
        $this->respond($user, 43200);
    }

    private function respond(array $user, int $ttl = 86400): never {
        Response::json([
            'token' => $this->jwt->issue(['sub' => (int)$user['id'], 'role' => $user['role']], $ttl),
            'expiresAt' => gmdate(DATE_ATOM, time() + $ttl),
            'user' => ['id' => (int)$user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role'], 'avatarUrl' => $user['avatar_url']],
        ]);
    }
}
