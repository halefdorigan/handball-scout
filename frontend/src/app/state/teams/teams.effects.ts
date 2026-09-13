import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, from, map, mergeMap, catchError, of, switchMap } from 'rxjs';
import { TeamRepository } from '../../core/repositories/team.repository';
import * as TeamsActions from './teams.actions';
import { Action } from '@ngrx/store';

@Injectable()
export class TeamsEffects {
  constructor(
    private actions$: Actions,
    private teams: TeamRepository
  ) {}

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      switchMap(() => this.teams.observeActive().pipe(
        map(teams => TeamsActions.loadTeamsSuccess({ teams })),
        catchError(error => of(TeamsActions.loadTeamsFailure({ error })))
      ))
    )
  );

  addTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.addTeam),
      mergeMap(action => from(this.teams.create(action.team)).pipe(
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );

  updateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.updateTeam),
      mergeMap(action => from(this.teams.update(action.team)).pipe(
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );

  deleteTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.deleteTeam),
      mergeMap(action => from(this.teams.archive(action.id)).pipe(
        mergeMap(doc => doc ? of(doc) : EMPTY),
        catchError(() => EMPTY)
      ))
    ),
    { dispatch: false }
  );
}
