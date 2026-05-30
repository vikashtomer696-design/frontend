<?php
require __DIR__.'/database.php';
rate_limit('login', 10, 3600);
$in = input(); $email = strtolower(trim($in['email'] ?? '')); $password = (string)($in['password'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) out(false, null, 'Enter a valid email and a 6+ character password');
$stmt = db()->prepare('SELECT * FROM users WHERE email=?'); $stmt->execute([$email]); $user = $stmt->fetch();
if (!$user) { $hash = password_hash($password, PASSWORD_DEFAULT); db()->prepare('INSERT INTO users(email,password_hash) VALUES(?,?)')->execute([$email,$hash]); $user = ['id'=>db()->lastInsertId(), 'email'=>$email, 'password_hash'=>$hash]; }
if (!password_verify($password, $user['password_hash'])) out(false, null, 'Invalid login');
$token = uuid(); db()->prepare('UPDATE users SET token_hash=? WHERE id=?')->execute([hash('sha256',$token), $user['id']]);
out(true, ['token'=>$token, 'userId'=>(string)$user['id'], 'displayName'=>explode('@',$email)[0]]);
