import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './schemas/team.schema';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async findAll(): Promise<TeamDocument[]> {
    return this.teamModel.find({ deleted: false }).exec();
  }

  async findOne(id: string): Promise<TeamDocument | null> {
    return this.teamModel.findById(id).exec();
  }

  async upsert(teamData: any): Promise<TeamDocument> {
    const { _id, ...updateData } = teamData;
    return this.teamModel.findByIdAndUpdate(_id, updateData, {
      upsert: true,
      new: true
    }).exec() as Promise<TeamDocument>;
  }

  async sync(teams: any[]): Promise<any> {
    const results: any[] = [];
    for (const team of teams) {
      results.push(await this.upsert(team));
    }
    return results;
  }
}
