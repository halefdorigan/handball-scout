import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { PlayerMembership } from '../../core/models/player.model';
import * as MembershipsActions from './memberships.actions';

export interface MembershipsState extends EntityState<PlayerMembership> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<PlayerMembership> = createEntityAdapter<PlayerMembership>({
  selectId: membership => membership._id
});

export const initialState: MembershipsState = adapter.getInitialState({
  loading: false,
  error: null
});

export const membershipsReducer = createReducer(
  initialState,
  on(MembershipsActions.loadMemberships, state => ({ ...state, loading: true })),
  on(MembershipsActions.loadMembershipsSuccess, (state, { memberships }) => adapter.setAll(memberships, { ...state, loading: false, error: null })),
  on(MembershipsActions.loadMembershipsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(MembershipsActions.addMembershipSuccess, (state, { membership }) => adapter.addOne(membership, state)),
  on(MembershipsActions.updateMembershipSuccess, (state, { membership }) => adapter.upsertOne(membership, state)),
  on(MembershipsActions.archiveMembershipSuccess, (state, { membership }) => adapter.upsertOne(membership, state))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();
