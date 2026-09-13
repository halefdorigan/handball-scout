/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';

@Injectable({ providedIn: 'root' })
export class TeamRepository extends LocalRepository {
  constructor(database: DatabaseService) { super(database); }
  observeActive(): Observable<any[]> { return from(this.collection('teams')).pipe(switchMap(c => c.find().$), map(items => (items as any[]).map((x: any) => x.toJSON()).filter((x: any) => !x.isDeleted))); }
  all(): Promise<any[]> { return this.list('teams'); }
  create(team: any): Promise<any> { return this.collection('teams').then(c => c.insert({ _id: uuidv4(), name: team.name, color: team.color || '#0a7281', tags: team.tags || [], updatedAt: Date.now(), isDeleted: false })); }
  update(team: any): Promise<any> { return this.collection('teams').then(c => c.upsert({ _id: team._id, name: team.name, color: team.color || '#0a7281', tags: team.tags || [], updatedAt: Date.now(), isDeleted: team.isDeleted ?? false })); }
  upsert(team: any): Promise<any> { return this.collection('teams').then(c => c.upsert(team)); }
  async archive(id: string): Promise<any | null> { const doc = await (await this.collection('teams')).findOne(id).exec(); return doc ? doc.modify((x: any) => ({ ...x, isDeleted: true, updatedAt: Date.now() })) : null; }
}
