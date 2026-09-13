export interface Player {
  _id: string;
  name: string;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  dominantHand?: 'RIGHT' | 'LEFT' | 'BOTH';
  updatedAt: number;
  isDeleted: boolean;
}

export type PlayerMembershipStatus = 'ACTIVE' | 'INACTIVE';

export interface PlayerMembership {
  _id: string;
  playerId: string;
  teamId: string;
  number?: number;
  position?: string;
  status: PlayerMembershipStatus;
  updatedAt: number;
  isDeleted: boolean;
}
