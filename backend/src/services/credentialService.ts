import { v4 as uuid } from 'uuid';
import { CredentialRepository } from '../repositories/credentialRepository';
import { encrypt } from '../utils/crypto';

export class CredentialService {
  constructor(private readonly credentialRepository: CredentialRepository) {}

  async create(ownerId: string, provider: string, payload: Record<string, unknown>) {
    const encrypted = encrypt(JSON.stringify(payload));
    const record = {
      id: uuid(),
      ownerId,
      provider,
      encryptedPayload: encrypted.encrypted,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.credentialRepository.create(record);
    return { id: record.id, provider: record.provider };
  }
}
