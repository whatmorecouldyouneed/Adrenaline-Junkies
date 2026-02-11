/**
 * colyseus schema for race room state
 */

import { Schema, type, MapSchema } from '@colyseus/schema';

export class PlayerState extends Schema {
  @type('string') displayName = 'player';
  @type('number') x = 0;
  @type('number') v = 0;
  @type('string') state = 'RUNNING';
  @type('string') expectedSide = 'L';
  @type('number') lastTapTime = 0;
  @type('number') cadenceMs = 0;
  @type('number') lockUntil = 0;
  @type('number') recoverUntil = 0;
  @type('number') lastProcessedSeq = -1;
  @type('boolean') ready = false;
  @type('number') placement = 0;
}

export class RaceState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type('string') phase = 'WAITING';
  @type('number') countdownStartAt = 0;
}
