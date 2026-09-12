import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, catchError, of, switchMap, Observable } from 'rxjs';
import { DatabaseService } from '../../core/db/database.service';
import * as TeamsActions from './teams.actions';
import { v4 as uuidv4 } from 'uuid';
import { Action } from '@ngrx/store';

@Injectable()
export class TeamsEffects {
  constructor(
    private actions$: Actions,
    private dbService: DatabaseService
  ) {}

  loadTeams$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.loadTeams),
      switchMap(() => from(this.dbService.getDb())),
      switchMap(db => (db['teams'].find().$ as Observable<any[]>).pipe(
        map(teams => TeamsActions.loadTeamsSuccess({ teams: teams.map((t: any) => t.toJSON()) })),
        catchError(error => of(TeamsActions.loadTeamsFailure({ error })))
      ))
    )
  );

  addTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.addTeam),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['teams'].insert({
          _id: uuidv4(),
          name: action.team.name,
          color: action.team.color || '#0a7281',
          tags: action.team.tags || [],
          updatedAt: Date.now(),
          isDeleted: false
        })),
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );

  updateTeam$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamsActions.updateTeam),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['teams'].upsert({
          _id: action.team._id,
          name: action.team.name,
          color: action.team.color || '#0a7281',
          tags: action.team.tags || [],
          updatedAt: Date.now(),
          isDeleted: action.team.isDeleted ?? false
        })),
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );
}
