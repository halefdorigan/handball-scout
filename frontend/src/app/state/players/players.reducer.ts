import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Player } from '../../core/models/player.model';
import * as PlayersActions from './players.actions';

export interface PlayersState extends EntityState<Player> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Player> = createEntityAdapter<Player>({
  selectId: (player: Player) => player._id
});

export const initialState: PlayersState = adapter.getInitialState({
  loading: false,
  error: null
});

export const playersReducer = createReducer(
  initialState,
  on(PlayersActions.loadPlayers, (state) => ({ ...state, loading: true })),
  on(PlayersActions.loadPlayersSuccess, (state, { players }) => adapter.setAll(players, { ...state, loading: false, error: null })),
  on(PlayersActions.loadPlayersFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(PlayersActions.addPlayerSuccess, (state, { player }) => adapter.addOne(player, state)),
  on(PlayersActions.updatePlayerSuccess, (state, { player }) => adapter.upsertOne(player, state)),
  on(PlayersActions.archivePlayerSuccess, (state, { player }) => adapter.upsertOne(player, state))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
