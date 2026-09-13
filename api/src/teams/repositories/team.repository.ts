import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from '../schemas/team.schema';

@Injectable()
export class TeamRepository {
  constructor(@InjectModel(Team.name) private readonly model: Model<TeamDocument>) {}

  findActive(): Promise<TeamDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  findById(id: string): Promise<TeamDocument | null> {
    return this.model.findById(id).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<TeamDocument> {
    return this.model.findByIdAndUpdate(id, data, { upsert: true, new: true }).exec() as Promise<TeamDocument>;
  }
}
