import { firestore } from '../config/firebase';
import { CredentialRecord } from '../types/workflow';

const collection = firestore.collection('credentials');

export class CredentialRepository {
  async create(record: CredentialRecord): Promise<void> {
    await collection.doc(record.id).set(record);
  }

  async findById(id: string): Promise<CredentialRecord | null> {
    const doc = await collection.doc(id).get();
    return doc.exists ? (doc.data() as CredentialRecord) : null;
  }
}
