import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { Game, GameSchema } from './schemas/game.schema';
import { GameRepository } from './repositories/game.repository';
import { MatchesModule } from '../matches/matches.module';
import { ScoutingModule } from '../scouting/scouting.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]), MatchesModule, ScoutingModule],
  controllers: [GamesController],
  providers: [GamesService, GameRepository],
  exports: [GamesService],
})
export class GamesModule {}
