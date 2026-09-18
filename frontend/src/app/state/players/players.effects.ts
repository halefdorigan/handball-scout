import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { PlayerRepository } from '../../core/repositories/player.repository';
import * as PlayersActions from './players.actions';

@Injectable()
export class PlayersEffects {
  constructor(
    private actions$: Actions,
    private players: PlayerRepository,
  ) {}

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadPlayers),
      switchMap(() =>
        this.players.observeAll().pipe(
          map((players) => PlayersActions.loadPlayersSuccess({ players })),
          catchError((error) => of(PlayersActions.loadPlayersFailure({ error }))),
        ),
      ),
    ),
  );

  addPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.addPlayer),
      mergeMap((action) =>
        from(this.players.create(action.player)).pipe(
          map((player: any) => PlayersActions.addPlayerSuccess({ player: player.toJSON() })),
          catchError((error) => of(PlayersActions.addPlayerFailure({ error }))),
        ),
      ),
    ),
  );

  updatePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.updatePlayer),
      mergeMap((action) =>
        from(this.players.update(action.player)).pipe(
          map((player: any) => PlayersActions.updatePlayerSuccess({ player: player.toJSON() })),
          catchError((error) => of(PlayersActions.updatePlayerFailure({ error }))),
        ),
      ),
    ),
  );

  deletePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.deletePlayer),
      map(({ id }) => PlayersActions.archivePlayer({ id })),
    ),
  );

  archivePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.archivePlayer),
      mergeMap((action) =>
        from(this.players.archive(action.id)).pipe(
          mergeMap((doc) => (doc ? of(doc) : EMPTY)),
          map((player: any) => PlayersActions.archivePlayerSuccess({ player: player.toJSON() })),
          catchError((error) => of(PlayersActions.archivePlayerFailure({ error }))),
        ),
      ),
    ),
  );
}
