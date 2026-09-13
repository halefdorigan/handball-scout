import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerMembershipsController } from './player-memberships.controller';
import { PlayerMembershipsService } from './player-memberships.service';
import { PlayerMembership, PlayerMembershipSchema } from './schemas/player-membership.schema';
import { PlayerMembershipRepository } from './repositories/player-membership.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: PlayerMembership.name, schema: PlayerMembershipSchema }])],
  controllers: [PlayerMembershipsController],
  providers: [PlayerMembershipsService, PlayerMembershipRepository],
  exports: [PlayerMembershipsService],
})
export class PlayerMembershipsModule {}
