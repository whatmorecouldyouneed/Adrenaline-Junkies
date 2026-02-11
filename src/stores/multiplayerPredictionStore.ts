/**
 * client prediction for multiplayer - apply tap locally, reconcile on server snapshot
 */

import { create } from 'zustand';
import { applyTap, stepRunner, createRunner, type Runner } from '../logic/runnerSim';
import type { TapSide } from '../logic/tapLogic';
import type { TapEvent, InputBuffer } from '../logic/inputBuffer';

type PlayerSnapshot = { t: number; x: number; v: number; state: string };
type RemoteSnapshots = Map<string, [PlayerSnapshot, PlayerSnapshot | null]>;

type ServerPlayerSnapshot = {
  x: number; v: number; state: string; expectedSide: string;
  lastTapTime: number; cadenceMs: number; lockUntil: number;
  recoverUntil: number; lastProcessedSeq: number;
};

type MultiplayerPredictionStore = {
  predictedRunner: Runner;
  lastValidTapAt: number;
  remoteSnapshots: RemoteSnapshots;
  tap: (side: TapSide, sendTap: (ev: TapEvent) => void, inputBuffer: InputBuffer) => void;
  step: (dt: number, now: number) => void;
  reconcile: (serverPlayer: ServerPlayerSnapshot, inputBuffer: Pick<InputBuffer, 'getPending' | 'pruneUpTo'>) => void;
  updateRemoteSnapshot: (sessionId: string, player: { x: number; v: number; state: string }) => void;
  getInterpolatedRemote: (sessionId: string, now: number) => { x: number; state: string } | null;
  reset: () => void;
};

/** rebase server times (Date.now) to client timebase (performance.now) */
function rebaseServerTimes(p: ServerPlayerSnapshot): Runner {
  const nowPerf = performance.now();
  const nowWall = Date.now();
  const offset = nowWall - nowPerf;

  const lockUntil = p.lockUntil > 0 ? Math.max(0, p.lockUntil - offset) : 0;
  const recoverUntil = p.recoverUntil > 0 ? Math.max(0, p.recoverUntil - offset) : 0;
  const lastTapTime =
    p.lastTapTime > 0 ? Math.max(0, p.lastTapTime - offset) : null;

  return {
    x: p.x,
    v: p.v,
    state: p.state as Runner['state'],
    expectedSide: p.expectedSide as TapSide,
    lastTapTime,
    cadenceMs: p.cadenceMs || null,
    lockUntil,
    recoverUntil,
  };
}

export const useMultiplayerPredictionStore = create<MultiplayerPredictionStore>((set, get) => ({
  predictedRunner: createRunner(),
  lastValidTapAt: 0,
  remoteSnapshots: new Map(),

  tap: (side, sendTap, inputBuffer) => {
    const now = performance.now();
    const ev = inputBuffer.push(side, now);
    sendTap(ev);
    const { predictedRunner } = get();
    const runner = { ...predictedRunner };
    applyTap(runner, side, now);
    const hadValidTap = runner.state !== 'STUMBLE';
    set({
      predictedRunner: runner,
      lastValidTapAt: hadValidTap ? now : get().lastValidTapAt,
    });
  },

  step: (dt, now) => {
    const { predictedRunner } = get();
    const runner = { ...predictedRunner };
    stepRunner(runner, dt, now);
    set({ predictedRunner: runner });
  },

  reconcile: (serverPlayer, inputBuffer) => {
    const runner = { ...rebaseServerTimes(serverPlayer) };
    const pending = inputBuffer.getPending(serverPlayer.lastProcessedSeq);
    for (const ev of pending) {
      applyTap(runner, ev.side, ev.time);
    }
    inputBuffer.pruneUpTo(serverPlayer.lastProcessedSeq);
    set({ predictedRunner: runner });
  },

  updateRemoteSnapshot: (sessionId, player) => {
    const snap: PlayerSnapshot = {
      t: performance.now(),
      x: player.x,
      v: player.v,
      state: player.state,
    };
    set((s) => {
      const next = new Map(s.remoteSnapshots);
      const prev = next.get(sessionId);
      const older = prev ? (prev[1] ?? prev[0]) : snap;
      next.set(sessionId, [older, snap]);
      return { remoteSnapshots: next };
    });
  },

  getInterpolatedRemote: (sessionId, now) => {
    const pair = get().remoteSnapshots.get(sessionId);
    if (!pair) return null;
    const [a, b] = pair;
    if (!b) return { x: a.x, state: a.state };
    const dt = b.t - a.t;
    if (dt <= 0) return { x: b.x, state: b.state };
    const alpha = Math.min(1, Math.max(0, (now - a.t) / dt));
    const x = a.x + (b.x - a.x) * alpha;
    return { x, state: alpha >= 0.5 ? b.state : a.state };
  },

  reset: () =>
    set({
      predictedRunner: createRunner(),
      lastValidTapAt: 0,
      remoteSnapshots: new Map(),
    }),
}));
