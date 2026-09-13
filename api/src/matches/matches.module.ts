import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match, MatchSchema } from './schemas/match.schema';
import { MatchRepository } from './repositories/match.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Match.name, schema: MatchSchema }])],
  controllers: [MatchesController],
  providers: [MatchesService, MatchRepository],
  exports: [MatchesService, MatchRepository],
})
export class MatchesModule {}
