import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game, GameSchema } from './schemas/game.schema';
import { Match, MatchSchema } from '../matches/schemas/match.schema';
import { ScoutingSession, ScoutingSessionSchema } from '../scouting/schemas/scouting-session.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Game.name, schema: GameSchema },
    { name: Match.name, schema: MatchSchema },
    { name: ScoutingSession.name, schema: ScoutingSessionSchema },
  ])],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
