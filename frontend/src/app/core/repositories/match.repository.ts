/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { LocalRepository } from './local.repository';
import { DatabaseService } from '../db/database.service';
@Injectable({ providedIn: 'root' })
export class MatchRepository extends LocalRepository { constructor(database: DatabaseService) { super(database); } all(): Promise<any[]> { return this.list('matches'); } upsert(match: any): Promise<any> { return this.collection('matches').then(c => c.upsert(match)); } }
