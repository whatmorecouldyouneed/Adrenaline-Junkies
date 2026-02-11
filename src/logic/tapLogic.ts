/**
 * pure tap evaluation - shared with server
 * input: last state + new tap; output: valid/stumble, next expected side, cadence
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

  // 1) side rule - must alternate
  if (side !== expectedSide) return { stumble: true };

  // 2) timing rule
  if (lastTapTime != null) {
    const delta = now - lastTapTime;

    const t = Math.min(1, speed / tuning.maxSpeed);
    const target =
      tuning.baseTargetMs + (tuning.minTargetMs - tuning.baseTargetMs) * t;
    const minMs = target * (1 - tuning.timingWindowPct);
    const maxMs = target * (1 + tuning.timingWindowPct);

    // timing stumble: correct side but wrong delta - advance expected so player can recover
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

  // first tap always valid (starts rhythm)
  return {
    stumble: false,
    valid: true,
    nextExpectedSide: expectedSide === 'L' ? 'R' : 'L',
    nextCadenceMs: cadenceMs,
    delta: null,
  };
}
