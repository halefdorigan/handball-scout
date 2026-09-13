import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { PlayerMembershipsService } from './player-memberships.service';

@Controller('player-memberships')
@UseGuards(JwtAuthGuard)
export class PlayerMembershipsController {
  constructor(private readonly membershipsService: PlayerMembershipsService) {}

  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  @Post('sync')
  sync(@Body() memberships: any[]) {
    return this.membershipsService.sync(memberships);
  }
}
