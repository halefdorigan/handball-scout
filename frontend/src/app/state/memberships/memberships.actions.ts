import { createAction, props } from '@ngrx/store';
import { PlayerMembership } from '../../core/models/player.model';

export const loadMemberships = createAction(
  '[Player Memberships] Load Memberships',
);
export const loadMembershipsSuccess = createAction(
  '[Player Memberships] Load Memberships Success',
  props<{ memberships: PlayerMembership[] }>(),
);
export const loadMembershipsFailure = createAction(
  '[Player Memberships] Load Memberships Failure',
  props<{ error: any }>(),
);

export const addMembership = createAction(
  '[Player Memberships] Add Membership',
  props<{ membership: Partial<PlayerMembership> }>(),
);
export const addMembershipSuccess = createAction(
  '[Player Memberships] Add Membership Success',
  props<{ membership: PlayerMembership }>(),
);
export const addMembershipFailure = createAction(
  '[Player Memberships] Add Membership Failure',
  props<{ error: any }>(),
);
export const updateMembership = createAction(
  '[Player Memberships] Update Membership',
  props<{ membership: PlayerMembership }>(),
);
export const updateMembershipSuccess = createAction(
  '[Player Memberships] Update Membership Success',
  props<{ membership: PlayerMembership }>(),
);
export const updateMembershipFailure = createAction(
  '[Player Memberships] Update Membership Failure',
  props<{ error: any }>(),
);
export const archiveMembership = createAction(
  '[Player Memberships] Archive Membership',
  props<{ id: string }>(),
);
export const archiveMembershipSuccess = createAction(
  '[Player Memberships] Archive Membership Success',
  props<{ membership: PlayerMembership }>(),
);
export const archiveMembershipFailure = createAction(
  '[Player Memberships] Archive Membership Failure',
  props<{ error: any }>(),
);
