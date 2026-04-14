/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, catchError, of, switchMap, Observable, EMPTY } from 'rxjs';
import { DatabaseService } from '../../core/db/database.service';
import * as GamesActions from './games.actions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesEffects {
  constructor(
    private actions$: Actions,
    private dbService: DatabaseService
  ) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.loadGames),
      switchMap(() => from(this.dbService.getDb()).pipe(
        switchMap(db => (db['games'].find().$ as Observable<any[]>).pipe(
          map(games => GamesActions.loadGamesSuccess({ games: games.map((g: any) => g.toJSON()) })),
          catchError(error => of(GamesActions.loadGamesFailure({ error })))
        ))
      ))
    )
  );

  addGame$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.addGame),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['games'].insert({
          _id: uuidv4(),
          name: action.game.name,
          dateTime: action.game.dateTime,
          teamAId: action.game.teamAId,
          teamBId: action.game.teamBId,
          tags: action.game.tags || [],
          status: 'PENDING',
          events: [],
          updatedAt: Date.now(),
          isDeleted: false
        })),
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );

  logGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.logGameEvent),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => from(db['games'].findOne(action.gameId).exec())),
        mergeMap((doc: any) => {
          if (!doc) return EMPTY;
          return from(doc.modify((d: any) => {
            d.events = [...(d.events || []), action.event];
            return d;
          }));
        }),
        map(() => GamesActions.logGameEventSuccess()),
        catchError(error => of(GamesActions.logGameEventFailure({ error })))
      ))
    )
  );

  undoGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.undoGameEvent),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => from(db['games'].findOne(action.gameId).exec())),
        mergeMap((doc: any) => {
          if (!doc) return EMPTY;
          return from(doc.modify((d: any) => {
            d.events = (d.events || []).slice(0, -1);
            return d;
          }));
        }),
        map(() => GamesActions.undoGameEventSuccess()),
        catchError(error => of(GamesActions.undoGameEventFailure({ error })))
      ))
    )
  );
}
