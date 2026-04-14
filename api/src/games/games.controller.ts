import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Post('sync')
  sync(@Body() games: any[]) {
    return this.gamesService.sync(games);
  }
}
