import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Player } from '../../core/models/player.model';
import { selectActiveMembershipsForTeam } from '../memberships/memberships.selectors';
import { adapter, PlayersState } from './players.reducer';

export const selectPlayersState =
  createFeatureSelector<PlayersState>('players');
export const {
  selectAll: selectAllPlayers,
  selectEntities: selectPlayerEntities,
} = adapter.getSelectors(selectPlayersState);

export const selectActivePlayers = createSelector(selectAllPlayers, (players) =>
  players.filter((player) => !player.isDeleted),
);

export const selectPlayerById = (playerId: string) =>
  createSelector(selectPlayerEntities, (players) => players[playerId]);

export const selectActivePlayersForTeam = (teamId: string) =>
  createSelector(
    selectActivePlayers,
    selectActiveMembershipsForTeam(teamId),
    (players, memberships) =>
      memberships.reduce((activePlayers, membership) => {
        const player = players.find((item) => item._id === membership.playerId);
        return player ? [...activePlayers, player] : activePlayers;
      }, [] as Player[]),
  );
