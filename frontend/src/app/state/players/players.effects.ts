import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, catchError, of, switchMap, Observable } from 'rxjs';
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
      switchMap(action => from(this.dbService.getDb()).pipe(
        switchMap(db => (db['players'].find({ selector: { teamId: action.teamId } }).$ as Observable<any[]>).pipe(
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
          teamId: action.player.teamId,
          name: action.player.name,
          number: action.player.number,
          position: action.player.position,
          updatedAt: Date.now(),
          deleted: false
        })),
        map(() => ({ type: 'NO_ACTION' }))
      ))
    ),
    { dispatch: false }
  );
}
