import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { DatabaseService } from '../../core/db/database.service';
import { PlayerMembership } from '../../core/models/player.model';
import * as MembershipsActions from './memberships.actions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MembershipsEffects {
  constructor(
    private actions$: Actions,
    private dbService: DatabaseService
  ) {}

  loadMemberships$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.loadMemberships),
      switchMap(() => from(this.dbService.getDb()).pipe(
        switchMap(db => (db['playerMemberships'].find().$ as Observable<any[]>).pipe(
          map(memberships => MembershipsActions.loadMembershipsSuccess({ memberships: memberships.map((membership: any) => membership.toJSON()) })),
          catchError(error => of(MembershipsActions.loadMembershipsFailure({ error })))
        ))
      ))
    )
  );

  addMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.addMembership),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['playerMemberships'].insert({
          _id: uuidv4(),
          playerId: action.membership.playerId,
          teamId: action.membership.teamId,
          ...(typeof action.membership.number === 'number' ? { number: action.membership.number } : {}),
          ...(action.membership.position ? { position: action.membership.position } : {}),
          status: action.membership.status || 'ACTIVE',
          updatedAt: Date.now(),
          isDeleted: false
        })),
        map((membership: any) => MembershipsActions.addMembershipSuccess({ membership: membership.toJSON() })),
        catchError(error => of(MembershipsActions.addMembershipFailure({ error })))
      ))
    )
  );

  updateMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.updateMembership),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['playerMemberships'].upsert({
          _id: action.membership._id,
          playerId: action.membership.playerId,
          teamId: action.membership.teamId,
          ...(typeof action.membership.number === 'number' ? { number: action.membership.number } : {}),
          ...(action.membership.position ? { position: action.membership.position } : {}),
          status: action.membership.status,
          updatedAt: Date.now(),
          isDeleted: action.membership.isDeleted
        })),
        map((membership: any) => MembershipsActions.updateMembershipSuccess({ membership: membership.toJSON() })),
        catchError(error => of(MembershipsActions.updateMembershipFailure({ error })))
      ))
    )
  );

  archiveMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.archiveMembership),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => from(db['playerMemberships'].findOne(action.id).exec())),
        mergeMap((doc: any) => {
          if (!doc) return EMPTY;

          return from(doc.modify((membership: PlayerMembership) => {
            membership.isDeleted = true;
            membership.status = 'INACTIVE';
            membership.updatedAt = Date.now();
            return membership;
          }));
        }),
        map((membership: any) => MembershipsActions.archiveMembershipSuccess({ membership: membership.toJSON() })),
        catchError(error => of(MembershipsActions.archiveMembershipFailure({ error })))
      ))
    )
  );
}
