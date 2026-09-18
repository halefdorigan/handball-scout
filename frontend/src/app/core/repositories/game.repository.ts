/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';

@Injectable({ providedIn: 'root' })
export class GameRepository extends LocalRepository {
  constructor(database: DatabaseService) {
    super(database);
  }
  observeAll(): Observable<any[]> {
    return from(this.collection('games')).pipe(
      switchMap((c) => c.find().$ as Observable<any[]>),
      map((items) => items.map((x: any) => x.toJSON())),
    );
  }
  create(game: any): Promise<any> {
    return this.collection('games').then((c) =>
      c.insert({
        _id: uuidv4(),
        ...game,
        status: 'PENDING',
        events: [],
        updatedAt: Date.now(),
        isDeleted: false,
      }),
    );
  }
  async appendEvent(id: string, event: any): Promise<any | null> {
    const doc = await (await this.collection('games')).findOne(id).exec();
    return doc
      ? doc.modify((x: any) => ({ ...x, events: [...(x.events || []), event] }))
      : null;
  }
  async undoEvent(id: string): Promise<any | null> {
    const doc = await (await this.collection('games')).findOne(id).exec();
    return doc
      ? doc.modify((x: any) => ({
          ...x,
          events: (x.events || []).slice(0, -1),
        }))
      : null;
  }
}
