import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScoutingController } from './scouting.controller';
import { ScoutingService } from './scouting.service';
import { ScoutingSession, ScoutingSessionSchema } from './schemas/scouting-session.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ScoutingSession.name, schema: ScoutingSessionSchema }])],
  controllers: [ScoutingController], providers: [ScoutingService], exports: [ScoutingService],
})
export class ScoutingModule {}
