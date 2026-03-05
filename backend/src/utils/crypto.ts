import crypto from 'crypto';
import { env } from '../config/env';

const algorithm = 'aes-256-gcm';
const key = crypto.createHash('sha256').update(env.ENCRYPTION_SECRET).digest();

export function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

export function decrypt(payload: { encrypted: string; iv: string; authTag: string }): string {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(payload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.encrypted, 'base64')),
    decipher.final()
  ]);

  return decrypted.toString('utf8');
}
