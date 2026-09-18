import { createAction, props } from '@ngrx/store';
import { Game, GameEvent } from '../../core/models/game.model';

export const loadGames = createAction('[Games] Load Games');
export const loadGamesSuccess = createAction(
  '[Games] Load Games Success',
  props<{ games: Game[] }>(),
);
export const loadGamesFailure = createAction(
  '[Games] Load Games Failure',
  props<{ error: any }>(),
);

export const addGame = createAction(
  '[Games] Add Game',
  props<{ game: Partial<Game> }>(),
);
export const deleteGame = createAction(
  '[Games] Delete Game',
  props<{ id: string }>(),
);

export const logGameEvent = createAction(
  '[Games] Log Game Event',
  props<{ gameId: string; event: GameEvent }>(),
);
export const logGameEventSuccess = createAction(
  '[Games] Log Game Event Success',
);
export const logGameEventFailure = createAction(
  '[Games] Log Game Event Failure',
  props<{ error: any }>(),
);

export const undoGameEvent = createAction(
  '[Games] Undo Game Event',
  props<{ gameId: string }>(),
);
export const undoGameEventSuccess = createAction(
  '[Games] Undo Game Event Success',
);
export const undoGameEventFailure = createAction(
  '[Games] Undo Game Event Failure',
  props<{ error: any }>(),
);

export const upsertGameFromDb = createAction(
  '[Games] Upsert Game From Db',
  props<{ game: Game }>(),
);
