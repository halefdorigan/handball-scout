import { createAction, props } from '@ngrx/store';

export const syncAll = createAction('[Sync] Sync All');
export const syncAllSuccess = createAction('[Sync] Sync All Success');
export const syncAllFailure = createAction('[Sync] Sync All Failure', props<{ error: any }>());
