import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService } from '../db/database.service';
import { from, lastValueFrom, Observable } from 'rxjs';

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
    await this.syncGames();
  }

  private async syncTeams() {
    const db = await this.dbService.getDb();
    const localTeams = await db['teams'].find().exec();
    const teamsData = localTeams.map((t: any) => t.toJSON());

    // Push
    const remoteTeams = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/teams/sync`, teamsData));

    // Pull (upsert back to local)
    for (const team of remoteTeams) {
      await db['teams'].upsert(team);
    }
  }

  private async syncPlayers() {
    const db = await this.dbService.getDb();
    const localPlayers = await db['players'].find().exec();
    const playersData = localPlayers.map((p: any) => p.toJSON());

    const remotePlayers = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/players/sync`, playersData));

    for (const player of remotePlayers) {
      await db['players'].upsert(player);
    }
  }

  private async syncGames() {
    const db = await this.dbService.getDb();
    const localGames = await db['games'].find().exec();
    const gamesData = localGames.map((g: any) => g.toJSON());

    const remoteGames = await lastValueFrom(this.http.post<any[]>(`${this.apiUrl}/games/sync`, gamesData));

    for (const game of remoteGames) {
      await db['games'].upsert(game);
    }
  }
}
