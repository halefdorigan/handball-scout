import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, map, mergeMap, catchError, of } from 'rxjs';
import { SyncService } from '../../core/services/sync.service';
import * as SyncActions from './sync.actions';

@Injectable()
export class SyncEffects {
  constructor(
    private actions$: Actions,
    private syncService: SyncService
  ) {}

  syncAll$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SyncActions.syncAll),
      mergeMap(() => from(this.syncService.syncAll()).pipe(
        map(() => SyncActions.syncAllSuccess()),
        catchError(error => of(SyncActions.syncAllFailure({ error })))
      ))
    )
  );
}
