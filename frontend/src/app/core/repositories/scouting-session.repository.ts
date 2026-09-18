/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';
@Injectable({ providedIn: 'root' })
export class ScoutingSessionRepository extends LocalRepository {
  constructor(database: DatabaseService) {
    super(database);
  }
  all(): Promise<any[]> {
    return this.list('scoutingSessions');
  }
  upsert(session: any): Promise<any> {
    return this.collection('scoutingSessions').then((c) => c.upsert(session));
  }
}
