import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScoutingSession, ScoutingSessionDocument } from '../schemas/scouting-session.schema';

@Injectable()
export class ScoutingSessionRepository {
  constructor(
    @InjectModel(ScoutingSession.name)
    private readonly model: Model<ScoutingSessionDocument>,
  ) {}

  findActive(): Promise<ScoutingSessionDocument[]> {
    return this.model.find({ deleted: false }).exec();
  }
  upsert(id: string, data: Record<string, unknown>): Promise<ScoutingSessionDocument> {
    return this.model
      .findByIdAndUpdate(id, data, { upsert: true, new: true })
      .exec() as Promise<ScoutingSessionDocument>;
  }
}
