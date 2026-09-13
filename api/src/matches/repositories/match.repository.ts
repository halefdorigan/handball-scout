import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Match, MatchDocument } from '../schemas/match.schema';

@Injectable()
export class MatchRepository {
  constructor(@InjectModel(Match.name) private readonly model: Model<MatchDocument>) {}

  findActive(): Promise<MatchDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<MatchDocument> {
    return this.model.findByIdAndUpdate(id, data, { upsert: true, new: true }).exec() as Promise<MatchDocument>;
  }
}
