/**
 * runner state machine - applyTap, stepRunner
 * shared with server
 */

import { TUNING } from '../constants/tuning';
import { evaluateTap, type TapSide } from './tapLogic';

export type RunnerState = 'RUNNING' | 'STUMBLE' | 'RECOVER' | 'FINISHED';

export type Runner = {
  x: number;
  v: number;
  state: RunnerState;
  expectedSide: TapSide;
  lastTapTime: number | null;
  cadenceMs: number | null;
  lockUntil: number;
  recoverUntil: number;
  lastProcessedSeq?: number;
};

export function createRunner(): Runner {
  return {
    x: 0,
    v: 0,
    state: 'RUNNING',
    expectedSide: 'L',
    lastTapTime: null,
    cadenceMs: null,
    lockUntil: 0,
    recoverUntil: 0,
  };
}

export function applyTap(
  runner: Runner,
  side: TapSide,
  now: number,
  tuning: typeof TUNING = TUNING
): void {
  if (runner.state === 'STUMBLE' && now < runner.lockUntil) return;
  if (runner.state === 'FINISHED') return;

  const res = evaluateTap({
    side,
    now,
    lastTapTime: runner.lastTapTime,
    expectedSide: runner.expectedSide,
    speed: runner.v,
    cadenceMs: runner.cadenceMs,
    tuning,
  });

  if (res.stumble) {
    runner.state = 'STUMBLE';
    runner.v *= tuning.stumbleVelocityMultiplier;
    runner.lockUntil = now + tuning.stumbleLockMs;
    runner.recoverUntil = runner.lockUntil + tuning.recoverMs;
    if ('nextExpectedSide' in res && res.nextExpectedSide) {
      runner.expectedSide = res.nextExpectedSide;
    }
    return;
  }

  if (
    runner.state === 'RECOVER' ||
    (runner.state === 'STUMBLE' && now >= runner.lockUntil)
  ) {
    runner.state = 'RECOVER';
  } else {
    runner.state = 'RUNNING';
  }

  const recoverAlpha =
    runner.state === 'RECOVER'
      ? Math.min(1, 1 - (runner.recoverUntil - now) / tuning.recoverMs)
      : 1;

  const impulse =
    tuning.baseImpulse *
    recoverAlpha *
    (1 / (1 + tuning.impulseFalloff * runner.v));
  runner.v = Math.min(tuning.maxSpeed, runner.v + impulse);

  runner.expectedSide = res.nextExpectedSide ?? runner.expectedSide;
  runner.lastTapTime = now;
  if (res.valid && 'nextCadenceMs' in res) {
    runner.cadenceMs = res.nextCadenceMs ?? runner.cadenceMs;
  }
}

export function stepRunner(
  runner: Runner,
  dt: number,
  now: number,
  tuning: typeof TUNING = TUNING
): void {
  if (runner.state === 'FINISHED') return;

  if (runner.state === 'STUMBLE' && now >= runner.lockUntil) {
    runner.state = 'RECOVER';
  }
  if (runner.state === 'RECOVER' && now >= runner.recoverUntil) {
    runner.state = 'RUNNING';
  }

  runner.v = Math.max(0, runner.v - tuning.drag * runner.v * dt);
  runner.x += runner.v * dt;

  if (runner.x >= tuning.trackLength) {
    runner.x = tuning.trackLength;
    runner.state = 'FINISHED';
  }
}
