import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, MembershipsState } from './memberships.reducer';

export const selectMembershipsState = createFeatureSelector<MembershipsState>('memberships');
export const { selectAll: selectAllMemberships, selectEntities: selectMembershipEntities } =
  adapter.getSelectors(selectMembershipsState);

export const selectActiveMemberships = createSelector(selectAllMemberships, (memberships) =>
  memberships.filter((membership) => !membership.isDeleted && membership.status === 'ACTIVE'),
);

export const selectMembershipsForPlayer = (playerId: string) =>
  createSelector(selectAllMemberships, (memberships) =>
    memberships.filter((membership) => membership.playerId === playerId && !membership.isDeleted),
  );

export const selectActiveMembershipsForTeam = (teamId: string) =>
  createSelector(selectActiveMemberships, (memberships) =>
    memberships.filter((membership) => membership.teamId === teamId),
  );
