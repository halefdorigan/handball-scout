/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, catchError, of, switchMap, EMPTY } from 'rxjs';
import { GameRepository } from '../../core/repositories/game.repository';
import * as GamesActions from './games.actions';

@Injectable()
export class GamesEffects {
  constructor(
    private actions$: Actions,
    private games: GameRepository,
  ) {}

  loadGames$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.loadGames),
      switchMap(() =>
        this.games.observeAll().pipe(
          map((games) => GamesActions.loadGamesSuccess({ games })),
          catchError((error) => of(GamesActions.loadGamesFailure({ error }))),
        ),
      ),
    ),
  );

  addGame$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GamesActions.addGame),
        mergeMap((action) => from(this.games.create(action.game)).pipe(map(() => ({ type: 'NO_ACTION' })))),
      ),
    { dispatch: false },
  );

  logGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.logGameEvent),
      mergeMap((action) =>
        from(this.games.appendEvent(action.gameId, action.event)).pipe(
          mergeMap((doc) => (doc ? of(doc) : EMPTY)),
          map(() => GamesActions.logGameEventSuccess()),
          catchError((error) => of(GamesActions.logGameEventFailure({ error }))),
        ),
      ),
    ),
  );

  undoGameEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GamesActions.undoGameEvent),
      mergeMap((action) =>
        from(this.games.undoEvent(action.gameId)).pipe(
          mergeMap((doc) => (doc ? of(doc) : EMPTY)),
          map(() => GamesActions.undoGameEventSuccess()),
          catchError((error) => of(GamesActions.undoGameEventFailure({ error }))),
        ),
      ),
    ),
  );
}
