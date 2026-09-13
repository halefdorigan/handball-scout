/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';

@Injectable({ providedIn: 'root' })
export class PlayerRepository extends LocalRepository {
  constructor(database: DatabaseService) { super(database); }
  observeAll(): Observable<any[]> { return from(this.collection('players')).pipe(switchMap(c => c.find().$ as Observable<any[]>), map(items => items.map((x: any) => x.toJSON()))); }
  all(): Promise<any[]> { return this.list('players'); }
  create(player: any): Promise<any> { return this.collection('players').then(c => c.insert({ _id: uuidv4(), name: player.name || '', ...(player.birthDate ? { birthDate: player.birthDate } : {}), ...(typeof player.heightCm === 'number' ? { heightCm: player.heightCm } : {}), ...(typeof player.weightKg === 'number' ? { weightKg: player.weightKg } : {}), ...(player.dominantHand ? { dominantHand: player.dominantHand } : {}), updatedAt: Date.now(), isDeleted: false })); }
  update(player: any): Promise<any> { return this.collection('players').then(c => c.upsert({ ...player, updatedAt: Date.now() })); }
  upsert(player: any): Promise<any> { return this.collection('players').then(c => c.upsert(player)); }
  async archive(id: string): Promise<any | null> { const doc = await (await this.collection('players')).findOne(id).exec(); return doc ? doc.modify((x: any) => ({ ...x, isDeleted: true, updatedAt: Date.now() })) : null; }
}
