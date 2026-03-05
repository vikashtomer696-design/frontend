import { v4 as uuid } from 'uuid';
import { decryptCredential, encryptCredential } from '../utils/encryption.js';

export class CredentialService {
  constructor({ credentialRepository }) {
    this.credentialRepository = credentialRepository;
  }

  async saveCredential({ userId, name, type, payload }) {
    const id = uuid();
    const encrypted = encryptCredential(payload);
    return this.credentialRepository.create(id, {
      userId,
      name,
      type,
      secret: encrypted,
      createdAt: new Date().toISOString()
    });
  }

  async getDecryptedCredential(id) {
    const credential = await this.credentialRepository.findById(id);
    if (!credential) return null;
    return { ...credential, secret: decryptCredential(credential.secret) };
  }
}
