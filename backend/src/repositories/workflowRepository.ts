import { firestore } from '../config/firebase';
import { WorkflowDefinition } from '../types/workflow';

const collection = firestore.collection('workflows');

export class WorkflowRepository {
  async create(workflow: WorkflowDefinition): Promise<void> {
    await collection.doc(workflow.id).set(workflow);
  }

  async update(id: string, workflow: Partial<WorkflowDefinition>): Promise<void> {
    await collection.doc(id).set({ ...workflow, updatedAt: new Date().toISOString() }, { merge: true });
  }

  async findById(id: string): Promise<WorkflowDefinition | null> {
    const doc = await collection.doc(id).get();
    return doc.exists ? (doc.data() as WorkflowDefinition) : null;
  }

  async findByWebhookPath(path: string): Promise<WorkflowDefinition | null> {
    const snap = await collection.where('webhookPath', '==', path).where('isActive', '==', true).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data() as WorkflowDefinition;
  }
}
