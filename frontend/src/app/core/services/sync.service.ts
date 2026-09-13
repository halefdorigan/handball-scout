import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../db/database.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private dbService: DatabaseService
  ) {}

  async syncAll() {
    await this.syncTeams();
    await this.syncPlayers();
    await this.syncMemberships();
    await this.syncMatches();
    await this.syncScoutingSessions();
  }

  private async syncTeams() {
    const db = await this.dbService.getDb();
    const localTeams = await db['teams'].find().exec();
    const teamsData = localTeams.map((t: any) => {
      const { isDeleted, ...team } = t.toJSON();
      return { ...team, deleted: isDeleted ?? false };
    });

    // Push
    const remoteTeams = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/teams/sync`, teamsData));

    // Pull (upsert back to local)
    for (const team of remoteTeams) {
      await db['teams'].upsert(this.normalizeTeam(team));
    }
  }

  private async syncPlayers() {
    const db = await this.dbService.getDb();
    const localPlayers = await db['players'].find().exec();
    const playersData = localPlayers.map((p: any) => p.toJSON());

    const remotePlayers = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/players/sync`, playersData));

    for (const player of remotePlayers) {
      await db['players'].upsert(this.normalizePlayer(player));
    }
  }

  private async syncMemberships() {
    const db = await this.dbService.getDb();
    const localMemberships = await db['playerMemberships'].find().exec();
    const membershipsData = localMemberships.map((membership: any) => membership.toJSON());

    const remoteMemberships = await lastValueFrom(
      this.http.post<any[]>(`${this.apiUrl}/player-memberships/sync`, membershipsData)
    );

    for (const membership of remoteMemberships) {
      await db['playerMemberships'].upsert(this.normalizeMembership(membership));
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
    const db = await this.dbService.getDb();
    const localMatches = await db['matches'].find().exec();
    const matchesData = localMatches.map((match: any) => {
      const data = match.toJSON();
      return { ...data, deleted: data.isDeleted ?? false };
    });

    const remoteMatches = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/matches/sync`, matchesData));

    for (const match of remoteMatches) {
      await db['matches'].upsert(this.normalizeMatch(match));
    }
  }

  private async syncScoutingSessions() {
    const db = await this.dbService.getDb();
    const sessions = await db['scoutingSessions'].find().exec();
    const payload = sessions.map((session: any) => {
      const data = session.toJSON();
      return { ...data, deleted: data.isDeleted ?? false };
    });
    const remote = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/scouting-sessions/sync`, payload));
    for (const session of remote) {
      await db['scoutingSessions'].upsert({
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
