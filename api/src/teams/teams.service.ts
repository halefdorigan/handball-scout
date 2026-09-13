import { Injectable } from '@nestjs/common';
import { Team, TeamDocument } from './schemas/team.schema';
import { TeamRepository } from './repositories/team.repository';

@Injectable()
export class TeamsService {
  constructor(private readonly teams: TeamRepository) {}

  async findAll(): Promise<TeamDocument[]> {
    return this.teams.findActive();
  }

  async findOne(id: string): Promise<TeamDocument | null> {
    return this.teams.findById(id);
  }

  async upsert(teamData: any): Promise<TeamDocument> {
    const { _id, isDeleted, deleted, ...updateData } = teamData;

    if (typeof isDeleted === 'boolean') {
      updateData.deleted = isDeleted;
    } else if (typeof deleted === 'boolean') {
      updateData.deleted = deleted;
    }

    return this.teams.upsert(_id, updateData);
  }

  async sync(teams: any[]): Promise<any> {
    const results: any[] = [];
    for (const team of teams) {
      results.push(await this.upsert(team));
    }
    return results;
  }
}
