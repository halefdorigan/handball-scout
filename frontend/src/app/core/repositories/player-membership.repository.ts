/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';

@Injectable({ providedIn: 'root' })
export class PlayerMembershipRepository extends LocalRepository {
  constructor(database: DatabaseService) {
    super(database);
  }
  observeAll(): Observable<any[]> {
    return from(this.collection('playerMemberships')).pipe(
      switchMap((c) => c.find().$ as Observable<any[]>),
      map((items) => items.map((x: any) => x.toJSON())),
    );
  }
  all(): Promise<any[]> {
    return this.list('playerMemberships');
  }
  create(membership: any): Promise<any> {
    return this.collection('playerMemberships').then((c) =>
      c.insert({
        _id: uuidv4(),
        ...membership,
        status: membership.status || 'ACTIVE',
        updatedAt: Date.now(),
        isDeleted: false,
      }),
    );
  }
  update(membership: any): Promise<any> {
    return this.collection('playerMemberships').then((c) =>
      c.upsert({ ...membership, updatedAt: Date.now() }),
    );
  }
  upsert(membership: any): Promise<any> {
    return this.collection('playerMemberships').then((c) =>
      c.upsert(membership),
    );
  }
  async archive(id: string): Promise<any | null> {
    const doc = await (
      await this.collection('playerMemberships')
    )
      .findOne(id)
      .exec();
    return doc
      ? doc.modify((x: any) => ({
          ...x,
          isDeleted: true,
          status: 'INACTIVE',
          updatedAt: Date.now(),
        }))
      : null;
  }
}
