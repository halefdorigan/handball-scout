import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Post('sync')
  sync(@Body() players: any[]) {
    return this.playersService.sync(players);
  }
}
