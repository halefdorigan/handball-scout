import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { ScoutingService, ScoutingSessionSyncData } from './scouting.service';

@Controller('scouting-sessions')
@UseGuards(JwtAuthGuard)
export class ScoutingController {
  constructor(private readonly scouting: ScoutingService) {}
  @Get() findAll() {
    return this.scouting.findAll();
  }
  @Post('sync') sync(@Body() data: ScoutingSessionSyncData[]) {
    return this.scouting.sync(data);
  }
}
