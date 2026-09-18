import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { PlayerMembershipRepository } from '../../core/repositories/player-membership.repository';
import * as MembershipsActions from './memberships.actions';

@Injectable()
export class MembershipsEffects {
  constructor(
    private actions$: Actions,
    private memberships: PlayerMembershipRepository,
  ) {}

  loadMemberships$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.loadMemberships),
      switchMap(() =>
        this.memberships.observeAll().pipe(
          map((memberships) =>
            MembershipsActions.loadMembershipsSuccess({ memberships }),
          ),
          catchError((error) =>
            of(MembershipsActions.loadMembershipsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  addMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.addMembership),
      mergeMap((action) =>
        from(this.memberships.create(action.membership)).pipe(
          map((membership: any) =>
            MembershipsActions.addMembershipSuccess({
              membership: membership.toJSON(),
            }),
          ),
          catchError((error) =>
            of(MembershipsActions.addMembershipFailure({ error })),
          ),
        ),
      ),
    ),
  );

  updateMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.updateMembership),
      mergeMap((action) =>
        from(this.memberships.update(action.membership)).pipe(
          map((membership: any) =>
            MembershipsActions.updateMembershipSuccess({
              membership: membership.toJSON(),
            }),
          ),
          catchError((error) =>
            of(MembershipsActions.updateMembershipFailure({ error })),
          ),
        ),
      ),
    ),
  );

  archiveMembership$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembershipsActions.archiveMembership),
      mergeMap((action) =>
        from(this.memberships.archive(action.id)).pipe(
          mergeMap((doc) => (doc ? of(doc) : EMPTY)),
          map((membership: any) =>
            MembershipsActions.archiveMembershipSuccess({
              membership: membership.toJSON(),
            }),
          ),
          catchError((error) =>
            of(MembershipsActions.archiveMembershipFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
