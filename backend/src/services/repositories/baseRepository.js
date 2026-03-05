import { db } from '../../config/firebase.js';

export class BaseRepository {
  constructor(collection) {
    this.collection = db.collection(collection);
  }

  async create(id, payload) {
    await this.collection.doc(id).set(payload);
    return { id, ...payload };
  }

  async update(id, payload) {
    await this.collection.doc(id).update(payload);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async findManyByField(field, operator, value) {
    const snapshot = await this.collection.where(field, operator, value).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}
