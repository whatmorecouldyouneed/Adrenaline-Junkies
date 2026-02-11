/**
 * zustand store for local runner state - single player
 */

import { create } from 'zustand';
import { applyTap, stepRunner, createRunner, type Runner } from '../logic/runnerSim';
import type { TapSide } from '../logic/tapLogic';

type RunnerStore = {
  runner: Runner;
  lastValidTapAt: number;
  tap: (side: TapSide) => void;
  step: (dt: number, now: number) => void;
  reset: () => void;
};

export const useRunnerStore = create<RunnerStore>((set, get) => ({
  runner: createRunner(),
  lastValidTapAt: 0,

  tap: (side: TapSide) => {
    const now = performance.now();
    const runner = { ...get().runner };
    applyTap(runner, side, now);
    const hadValidTap = runner.state !== 'STUMBLE';
    set({ runner, lastValidTapAt: hadValidTap ? now : get().lastValidTapAt });
  },

  step: (dt: number, now: number) => {
    const runner = { ...get().runner };
    stepRunner(runner, dt, now);
    set({ runner });
  },

  reset: () => set({ runner: createRunner(), lastValidTapAt: 0 }),
}));
