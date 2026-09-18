/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatabaseService } from '../db/database.service';

export abstract class LocalRepository {
  constructor(protected readonly database: DatabaseService) {}

  protected collection(name: string): Promise<any> {
    return this.database.getDb().then((db) => db[name]);
  }

  protected list(name: string): Promise<any[]> {
    return this.collection(name).then((collection) => collection.find().exec());
  }
}
