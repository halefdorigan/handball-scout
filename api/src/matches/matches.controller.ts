import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { MatchesService, MatchSyncData } from './matches.service';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matches: MatchesService) {}

  @Get()
  findAll() { return this.matches.findAll(); }

  @Post('sync')
  sync(@Body() data: MatchSyncData[]) { return this.matches.sync(data); }
}
