import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { PlayersModule } from './players/players.module';
import { PlayerMembershipsModule } from './player-memberships/player-memberships.module';
import { GamesModule } from './games/games.module';
import { MatchesModule } from './matches/matches.module';
import { ScoutingModule } from './scouting/scouting.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/handball-scout'),
    AuthModule,
    TeamsModule,
    PlayersModule,
    PlayerMembershipsModule,
    GamesModule,
    MatchesModule,
    ScoutingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
