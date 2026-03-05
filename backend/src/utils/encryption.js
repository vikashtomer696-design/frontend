import crypto from 'crypto';
import { env } from '../config/env.js';

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;

function getKey() {
  return crypto.createHash('sha256').update(env.encryptionKey || '').digest();
}

export function encryptCredential(payload) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    data: encrypted.toString('base64')
  };
}

export function decryptCredential(encryptedPayload) {
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(encryptedPayload.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(encryptedPayload.tag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPayload.data, 'base64')),
    decipher.final()
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}
