/**
 * holds current race room ref for multiplayer - set by lobby, read by game
 */

import React, { createContext, useContext, useCallback, useState } from 'react';
import type { Room } from 'colyseus.js';
import { colyseusClient } from '../services/colyseus';
import { getPlayerName } from '../utils/playerStorage';

type RaceRoomContextValue = {
  room: Room | null;
  roomId: string | null;
  createRoom: () => Promise<string>;
  joinRoom: (id: string) => Promise<void>;
  leaveRoom: () => void;
};

const RaceRoomContext = createContext<RaceRoomContextValue | null>(null);

export function RaceRoomProvider({ children }: { children: React.ReactNode }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const getDisplayName = useCallback(async () => {
    const name = (await getPlayerName()).trim();
    return name || 'player';
  }, []);

  const createRoom = useCallback(async () => {
    const displayName = await getDisplayName();
    const r = await colyseusClient.create('race_room', { displayName });
    setRoom(r);
    setRoomId(r.roomId);
    return r.roomId;
  }, [getDisplayName]);

  const joinRoom = useCallback(async (id: string) => {
    const displayName = await getDisplayName();
    const r = await colyseusClient.joinById(id, { displayName });
    setRoom(r);
    setRoomId(r.roomId);
  }, [getDisplayName]);

  const leaveRoom = useCallback(() => {
    room?.leave();
    setRoom(null);
    setRoomId(null);
  }, [room]);

  return (
    <RaceRoomContext.Provider value={{ room, roomId, createRoom, joinRoom, leaveRoom }}>
      {children}
    </RaceRoomContext.Provider>
  );
}

export function useRaceRoom() {
  const ctx = useContext(RaceRoomContext);
  if (!ctx) throw new Error('useRaceRoom must be used within RaceRoomProvider');
  return ctx;
}

export function useRaceRoomOptional() {
  return useContext(RaceRoomContext);
}
