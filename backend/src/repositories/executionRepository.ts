import { firestore } from '../config/firebase';
import { WorkflowExecution } from '../types/workflow';

const collection = firestore.collection('executions');

export class ExecutionRepository {
  async create(execution: WorkflowExecution): Promise<void> {
    await collection.doc(execution.id).set(execution);
  }

  async update(id: string, partial: Partial<WorkflowExecution>): Promise<void> {
    await collection.doc(id).set(partial, { merge: true });
  }

  async listByWorkflow(workflowId: string): Promise<WorkflowExecution[]> {
    const snap = await collection
      .where('workflowId', '==', workflowId)
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    return snap.docs.map((doc) => doc.data() as WorkflowExecution);
  }

  async findById(id: string): Promise<WorkflowExecution | null> {
    const doc = await collection.doc(id).get();
    return doc.exists ? (doc.data() as WorkflowExecution) : null;
  }
}
