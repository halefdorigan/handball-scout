import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoutingController } from './scouting.controller';
import { ScoutingService } from './scouting.service';
import { ScoutingSession, ScoutingSessionSchema } from './schemas/scouting-session.schema';
import { ScoutingSessionRepository } from './repositories/scouting-session.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: ScoutingSession.name, schema: ScoutingSessionSchema }])],
  controllers: [ScoutingController],
  providers: [ScoutingService, ScoutingSessionRepository],
  exports: [ScoutingService, ScoutingSessionRepository],
})
export class ScoutingModule {}
