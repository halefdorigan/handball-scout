import { createAction, props } from '@ngrx/store';
import { Player } from '../../core/models/player.model';

export const loadPlayers = createAction('[Players] Load Players', props<{ teamId: string }>());
export const loadPlayersSuccess = createAction('[Players] Load Players Success', props<{ players: Player[] }>());
export const loadPlayersFailure = createAction('[Players] Load Players Failure', props<{ error: any }>());

export const addPlayer = createAction('[Players] Add Player', props<{ player: Partial<Player> }>());
export const updatePlayer = createAction('[Players] Update Player', props<{ player: Player }>());
export const deletePlayer = createAction('[Players] Delete Player', props<{ id: string }>());
