import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TeamRepository } from '../repositories/team.repository';
import { PlayerRepository } from '../repositories/player.repository';
import { PlayerMembershipRepository } from '../repositories/player-membership.repository';
import { MatchRepository } from '../repositories/match.repository';
import { ScoutingSessionRepository } from '../repositories/scouting-session.repository';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private teams: TeamRepository,
    private players: PlayerRepository,
    private memberships: PlayerMembershipRepository,
    private matches: MatchRepository,
    private sessions: ScoutingSessionRepository,
  ) {}

  async syncAll() {
    await this.syncTeams();
    await this.syncPlayers();
    await this.syncMemberships();
    await this.syncMatches();
    await this.syncScoutingSessions();
  }

  private async syncTeams() {
    const localTeams = await this.teams.all();
    const teamsData = localTeams.map((t: any) => {
      const { isDeleted, ...team } = t.toJSON();
      return { ...team, deleted: isDeleted ?? false };
    });

    // Push
    const remoteTeams = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/teams/sync`, teamsData));

    // Pull (upsert back to local)
    for (const team of remoteTeams) {
      await this.teams.upsert(this.normalizeTeam(team));
    }
  }

  private async syncPlayers() {
    const localPlayers = await this.players.all();
    const playersData = localPlayers.map((p: any) => p.toJSON());

    const remotePlayers = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/players/sync`, playersData));

    for (const player of remotePlayers) {
      await this.players.upsert(this.normalizePlayer(player));
    }
  }

  private async syncMemberships() {
    const localMemberships = await this.memberships.all();
    const membershipsData = localMemberships.map((membership: any) => membership.toJSON());

    const remoteMemberships = await lastValueFrom(
      this.http.post<any[]>(`${this.apiUrl}/player-memberships/sync`, membershipsData)
    );

    for (const membership of remoteMemberships) {
      await this.memberships.upsert(this.normalizeMembership(membership));
    }
  }

  private normalizePlayer(player: any) {
    return {
      _id: player._id,
      name: player.name,
      ...(player.birthDate ? { birthDate: player.birthDate } : {}),
      ...(typeof player.heightCm === 'number' ? { heightCm: player.heightCm } : {}),
      ...(typeof player.weightKg === 'number' ? { weightKg: player.weightKg } : {}),
      ...(player.dominantHand ? { dominantHand: player.dominantHand } : {}),
      updatedAt: this.normalizeUpdatedAt(player.updatedAt),
      isDeleted: player.isDeleted ?? player.deleted ?? false
    };
  }

  private normalizeMembership(membership: any) {
    return {
      _id: membership._id,
      playerId: membership.playerId,
      teamId: membership.teamId,
      ...(typeof membership.number === 'number' ? { number: membership.number } : {}),
      ...(membership.position ? { position: membership.position } : {}),
      status: membership.status || 'ACTIVE',
      updatedAt: this.normalizeUpdatedAt(membership.updatedAt),
      isDeleted: membership.isDeleted ?? membership.deleted ?? false
    };
  }

  private normalizeUpdatedAt(updatedAt: number | string | Date | undefined): number {
    if (typeof updatedAt === 'number') return updatedAt;
    if (updatedAt instanceof Date) return updatedAt.getTime();

    const parsed = updatedAt ? Date.parse(updatedAt) : NaN;
    return Number.isNaN(parsed) ? Date.now() : parsed;
  }

  private async syncMatches() {
    const localMatches = await this.matches.all();
    const matchesData = localMatches.map((match: any) => {
      const data = match.toJSON();
      return { ...data, deleted: data.isDeleted ?? false };
    });

    const remoteMatches = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/matches/sync`, matchesData));

    for (const match of remoteMatches) {
      await this.matches.upsert(this.normalizeMatch(match));
    }
  }

  private async syncScoutingSessions() {
    const sessions = await this.sessions.all();
    const payload = sessions.map((session: any) => {
      const data = session.toJSON();
      return { ...data, deleted: data.isDeleted ?? false };
    });
    const remote = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/scouting-sessions/sync`, payload));
    for (const session of remote) {
      await this.sessions.upsert({
        _id: session._id, matchId: session.matchId, elapsedSeconds: session.elapsedSeconds || 0,
        events: session.events || [], updatedAt: this.normalizeUpdatedAt(session.updatedAt),
        isDeleted: session.isDeleted ?? session.deleted ?? false
      });
    }
  }

  private normalizeTeam(team: any) {
    return {
      _id: team._id,
      name: team.name,
      ...(team.color ? { color: team.color } : {}),
      ...(Array.isArray(team.tags) ? { tags: team.tags } : {}),
      updatedAt: this.normalizeUpdatedAt(team.updatedAt),
      isDeleted: team.isDeleted ?? team.deleted ?? false
    };
  }

  private normalizeMatch(game: any) {
    return {
      _id: game._id,
      name: game.name,
      ...(game.dateTime ? { dateTime: game.dateTime } : {}),
      ...(game.homeTeamId ? { homeTeamId: game.homeTeamId } : {}),
      ...(game.awayTeamId ? { awayTeamId: game.awayTeamId } : {}),
      ...(Array.isArray(game.tags) ? { tags: game.tags } : {}),
      ...(game.status ? { status: game.status } : {}),
      updatedAt: this.normalizeUpdatedAt(game.updatedAt),
      isDeleted: game.isDeleted ?? game.deleted ?? false
    };
  }
}
