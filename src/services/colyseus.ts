/**
 * colyseus client singleton for rhythm-sprint multiplayer
 * requires: yarn add colyseus.js buffer
 * add buffer + AsyncStorage polyfills in index.ts before importing app
 */

import { Client } from 'colyseus.js';

// use http for matchmaking (client uses http for create/join, then ws for room)
const COLYSEUS_URL =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_COLYSEUS_URL
    ? String(process.env.EXPO_PUBLIC_COLYSEUS_URL).replace(/^ws:/, 'http:')
    : 'http://localhost:2567';

export const colyseusClient = new Client(COLYSEUS_URL);

export type RoomPhase = 'countdown' | 'racing' | 'finished';

export async function createRaceRoom(): Promise<string> {
  const room = await colyseusClient.create('race_room', {});
  return room.roomId;
}

export async function joinRaceRoom(roomId: string) {
  return colyseusClient.joinById(roomId);
}
