import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { DatabaseService } from '../../core/db/database.service';
import * as PlayersActions from './players.actions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersEffects {
  constructor(
    private actions$: Actions,
    private dbService: DatabaseService
  ) {}

  loadPlayers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.loadPlayers),
      switchMap(() => from(this.dbService.getDb()).pipe(
        switchMap(db => (db['players'].find().$ as Observable<any[]>).pipe(
          map(players => PlayersActions.loadPlayersSuccess({ players: players.map((p: any) => p.toJSON()) })),
          catchError(error => of(PlayersActions.loadPlayersFailure({ error })))
        ))
      ))
    )
  );

  addPlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.addPlayer),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['players'].insert({
          _id: uuidv4(),
          name: action.player.name || '',
          ...(action.player.birthDate ? { birthDate: action.player.birthDate } : {}),
          ...(typeof action.player.heightCm === 'number' ? { heightCm: action.player.heightCm } : {}),
          ...(typeof action.player.weightKg === 'number' ? { weightKg: action.player.weightKg } : {}),
          ...(action.player.dominantHand ? { dominantHand: action.player.dominantHand } : {}),
          updatedAt: Date.now(),
          isDeleted: false
        })),
        map((player: any) => PlayersActions.addPlayerSuccess({ player: player.toJSON() })),
        catchError(error => of(PlayersActions.addPlayerFailure({ error })))
      ))
    )
  );

  updatePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.updatePlayer),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => db['players'].upsert({
          _id: action.player._id,
          name: action.player.name,
          ...(action.player.birthDate ? { birthDate: action.player.birthDate } : {}),
          ...(typeof action.player.heightCm === 'number' ? { heightCm: action.player.heightCm } : {}),
          ...(typeof action.player.weightKg === 'number' ? { weightKg: action.player.weightKg } : {}),
          ...(action.player.dominantHand ? { dominantHand: action.player.dominantHand } : {}),
          updatedAt: Date.now(),
          isDeleted: action.player.isDeleted
        })),
        map((player: any) => PlayersActions.updatePlayerSuccess({ player: player.toJSON() })),
        catchError(error => of(PlayersActions.updatePlayerFailure({ error })))
      ))
    )
  );

  deletePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.deletePlayer),
      map(({ id }) => PlayersActions.archivePlayer({ id }))
    )
  );

  archivePlayer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PlayersActions.archivePlayer),
      mergeMap(action => from(this.dbService.getDb()).pipe(
        mergeMap(db => from(db['players'].findOne(action.id).exec())),
        mergeMap((doc: any) => {
          if (!doc) return EMPTY;

          return from(doc.modify((player: any) => {
            player.isDeleted = true;
            player.updatedAt = Date.now();
            return player;
          }));
        }),
        map((player: any) => PlayersActions.archivePlayerSuccess({ player: player.toJSON() })),
        catchError(error => of(PlayersActions.archivePlayerFailure({ error })))
      ))
    )
  );

}
