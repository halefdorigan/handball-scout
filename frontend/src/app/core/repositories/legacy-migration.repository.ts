/* eslint-disable @typescript-eslint/no-explicit-any */
export async function migrateLegacyData(db: any): Promise<void> {
  const games = await db['games'].find().exec();
  for (const gameDocument of games) {
    const game = gameDocument.toJSON();
    const match = await db['matches'].findOne(game._id).exec();
    if (!match)
      await db['matches'].insert({
        _id: game._id,
        name: game.name,
        dateTime: game.dateTime,
        homeTeamId: game.teamAId,
        awayTeamId: game.teamBId,
        tags: game.tags || [],
        status: game.status || 'PENDING',
        updatedAt: game.updatedAt || Date.now(),
        isDeleted: game.isDeleted ?? false,
      });
    const sessionId = `scout-${game._id}`;
    const session = await db['scoutingSessions'].findOne(sessionId).exec();
    if (!session)
      await db['scoutingSessions'].insert({
        _id: sessionId,
        matchId: game._id,
        elapsedSeconds: 0,
        events: (game.events || []).map((event: any, index: number) => ({
          ...event,
          sequence: index + 1,
          type:
            event.type === 'MIN2'
              ? 'TWO_MINUTES'
              : event.type === 'YELLOW'
                ? 'YELLOW_CARD'
                : event.type,
        })),
        updatedAt: game.updatedAt || Date.now(),
        isDeleted: game.isDeleted ?? false,
      });
  }
  const players = await db['players'].find().exec();
  for (const player of players) {
    const data = player.toJSON();
    if (!data.legacyTeamId) continue;
    const id = `legacy-${data._id}-${data.legacyTeamId}`;
    if (!(await db['playerMemberships'].findOne(id).exec()))
      await db['playerMemberships'].insert({
        _id: id,
        playerId: data._id,
        teamId: data.legacyTeamId,
        number: typeof data.legacyNumber === 'number' ? data.legacyNumber : 0,
        position: data.legacyPosition || 'Não definida',
        status: data.isDeleted ? 'INACTIVE' : 'ACTIVE',
        updatedAt: data.updatedAt || Date.now(),
        isDeleted: data.isDeleted ?? false,
      });
    await player.modify((value: any) => {
      delete value.legacyTeamId;
      delete value.legacyNumber;
      delete value.legacyPosition;
      return value;
    });
  }
}
