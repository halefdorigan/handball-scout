import { createAction, props } from '@ngrx/store';
import { Player } from '../../core/models/player.model';

export const loadPlayers = createAction('[Players] Load Players');
export const loadPlayersSuccess = createAction(
  '[Players] Load Players Success',
  props<{ players: Player[] }>(),
);
export const loadPlayersFailure = createAction(
  '[Players] Load Players Failure',
  props<{ error: any }>(),
);

export const addPlayer = createAction(
  '[Players] Add Player',
  props<{ player: Partial<Player> }>(),
);
export const addPlayerSuccess = createAction(
  '[Players] Add Player Success',
  props<{ player: Player }>(),
);
export const addPlayerFailure = createAction(
  '[Players] Add Player Failure',
  props<{ error: any }>(),
);
export const updatePlayer = createAction(
  '[Players] Update Player',
  props<{ player: Player }>(),
);
export const updatePlayerSuccess = createAction(
  '[Players] Update Player Success',
  props<{ player: Player }>(),
);
export const updatePlayerFailure = createAction(
  '[Players] Update Player Failure',
  props<{ error: any }>(),
);
export const deletePlayer = createAction(
  '[Players] Delete Player',
  props<{ id: string }>(),
);
export const archivePlayer = createAction(
  '[Players] Archive Player',
  props<{ id: string }>(),
);
export const archivePlayerSuccess = createAction(
  '[Players] Archive Player Success',
  props<{ player: Player }>(),
);
export const archivePlayerFailure = createAction(
  '[Players] Archive Player Failure',
  props<{ error: any }>(),
);
