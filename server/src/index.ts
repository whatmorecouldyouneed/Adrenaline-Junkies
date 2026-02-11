/**
 * colyseus game server - bind 0.0.0.0 for lan access
 */

import { Server } from 'colyseus';
import { RaceRoom } from './rooms/RaceRoom';

const PORT = parseInt(process.env.PORT || '2567', 10);

const server = new Server();
server.define('race_room', RaceRoom);

server.listen(PORT, '0.0.0.0').then(() => {
  console.log(`[colyseus] listening on ws://0.0.0.0:${PORT}`);
});
