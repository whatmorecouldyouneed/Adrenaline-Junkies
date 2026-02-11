/**
 * syncs room state to prediction store - reconciliation + remote snapshots
 */

import { useEffect } from 'react';
import type { Room } from 'colyseus.js';
import type { InputBuffer } from '../logic/inputBuffer';
import { useMultiplayerPredictionStore } from '../stores/multiplayerPredictionStore';

export function useMultiplayerRoomSync(
  room: Room | null,
  roomId: string | undefined,
  inputBuffer: InputBuffer,
  onStateChange?: () => void
) {
  const predReset = useMultiplayerPredictionStore((s) => s.reset);
  const predReconcile = useMultiplayerPredictionStore((s) => s.reconcile);
  const predUpdateRemote = useMultiplayerPredictionStore((s) => s.updateRemoteSnapshot);

  useEffect(() => {
    if (!room || room.roomId !== roomId) return;

    predReset();

    const handler = () => {

      const players = room.state.players;
      const myP = players.get(room.sessionId);

      if (myP) {
        if (room.state.phase === 'WAITING' && myP.x === 0) {
          inputBuffer.clear();
        }
        predReconcile(
          {
            x: myP.x,
            v: myP.v,
            state: myP.state,
            expectedSide: myP.expectedSide,
            lastTapTime: myP.lastTapTime,
            cadenceMs: myP.cadenceMs,
            lockUntil: myP.lockUntil,
            recoverUntil: myP.recoverUntil,
            lastProcessedSeq: myP.lastProcessedSeq,
          },
          inputBuffer
        );
      }

      players.forEach((p: { x: number; v: number; state: string }, id: string) => {
        if (id !== room.sessionId) {
          predUpdateRemote(id, { x: p.x, v: p.v, state: p.state });
        }
      });

      onStateChange?.();
    };

    room.onStateChange(handler);
    handler();
    return () => room.onStateChange.remove(handler);
  }, [room, roomId, predReset, predReconcile, predUpdateRemote, inputBuffer, onStateChange]);
}
