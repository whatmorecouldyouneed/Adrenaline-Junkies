/**
 * pure tap evaluation - shared with client
 */

import type { TUNING } from '../constants/tuning';

export type TapSide = 'L' | 'R';

export type TapResult =
  | { stumble: true; nextExpectedSide?: TapSide }
  | {
      stumble: false;
      valid: true;
      nextExpectedSide: TapSide;
      nextCadenceMs: number | null;
      delta: number | null;
    };

export function evaluateTap(params: {
  side: TapSide;
  now: number;
  lastTapTime: number | null;
  expectedSide: TapSide;
  speed: number;
  cadenceMs: number | null;
  tuning: typeof TUNING;
}): TapResult {
  const { side, now, lastTapTime, expectedSide, speed, cadenceMs, tuning } = params;

  if (side !== expectedSide) return { stumble: true };

  if (lastTapTime != null) {
    const delta = now - lastTapTime;
    const t = Math.min(1, speed / tuning.maxSpeed);
    const target =
      tuning.baseTargetMs + (tuning.minTargetMs - tuning.baseTargetMs) * t;
    const minMs = target * (1 - tuning.timingWindowPct);
    const maxMs = target * (1 + tuning.timingWindowPct);

    if (delta < minMs || delta > maxMs) {
      return { stumble: true, nextExpectedSide: expectedSide === 'L' ? 'R' : 'L' };
    }

    const nextCadence =
      cadenceMs == null
        ? delta
        : cadenceMs + tuning.cadenceEmaAlpha * (delta - cadenceMs);

    return {
      stumble: false,
      valid: true,
      nextExpectedSide: expectedSide === 'L' ? 'R' : 'L',
      nextCadenceMs: nextCadence,
      delta,
    };
  }

  return {
    stumble: false,
    valid: true,
    nextExpectedSide: expectedSide === 'L' ? 'R' : 'L',
    nextCadenceMs: cadenceMs,
    delta: null,
  };
}
