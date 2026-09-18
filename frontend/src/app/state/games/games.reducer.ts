import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Game } from '../../core/models/game.model';
import * as GamesActions from './games.actions';

export interface GamesState extends EntityState<Game> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Game> = createEntityAdapter<Game>({
  selectId: (game: Game) => game._id,
});

export const initialState: GamesState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const gamesReducer = createReducer(
  initialState,
  on(GamesActions.loadGames, (state) => ({ ...state, loading: true })),
  on(GamesActions.loadGamesSuccess, (state, { games }) =>
    adapter.setAll(games, { ...state, loading: false }),
  ),
  on(GamesActions.loadGamesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(GamesActions.upsertGameFromDb, (state, { game }) =>
    adapter.upsertOne(game, state),
  ),
  on(GamesActions.logGameEvent, (state, { gameId, event }) => {
    const game = state.entities[gameId];
    if (!game) return state;
    return adapter.updateOne(
      {
        id: gameId,
        changes: {
          events: [...(game.events || []), event],
        },
      },
      state,
    );
  }),
  on(GamesActions.undoGameEvent, (state, { gameId }) => {
    const game = state.entities[gameId];
    if (!game || !game.events || game.events.length === 0) return state;
    return adapter.updateOne(
      {
        id: gameId,
        changes: {
          events: game.events.slice(0, -1),
        },
      },
      state,
    );
  }),
);

export const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();
