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
    await this.syncGames();
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

  private async syncGames() {
    const db = await this.dbService.getDb();
    const localGames = await db['games'].find().exec();
    const gamesData = localGames.map((g: any) => g.toJSON());

    const remoteGames = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/games/sync`, gamesData));

    for (const game of remoteGames) {
      await db['games'].upsert(this.normalizeGame(game));
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

  private normalizeGame(game: any) {
    return {
      _id: game._id,
      name: game.name,
      ...(game.dateTime ? { dateTime: game.dateTime } : {}),
      ...(game.teamAId ? { teamAId: game.teamAId } : {}),
      ...(game.teamBId ? { teamBId: game.teamBId } : {}),
      ...(Array.isArray(game.tags) ? { tags: game.tags } : {}),
      ...(game.status ? { status: game.status } : {}),
      ...(Array.isArray(game.events) ? { events: game.events } : {}),
      updatedAt: this.normalizeUpdatedAt(game.updatedAt),
      isDeleted: game.isDeleted ?? game.deleted ?? false
    };
  }
}
