/**
 * rhythm-sprint tuning - shared between client and server
 * must match server/src/constants/tuning.ts
 */

export const TUNING = {
  trackLength: 100,

  // velocity / acceleration feel
  baseImpulse: 0.9,
  impulseFalloff: 0.06,
  drag: 0.9,
  maxSpeed: 12,

  // cadence windows (ms) - dynamic around target cadence
  cadenceEmaAlpha: 0.2,
  baseTargetMs: 180,
  minTargetMs: 110,
  timingWindowPct: 0.35,

  // stumble
  stumbleVelocityMultiplier: 0.25,
  stumbleLockMs: 280,
  recoverMs: 900,

  // net / sim
  serverTickHz: 30,
  snapshotHz: 10,
  countdownMs: 3000,
} as const;

/** camera - temple run / subway surfers style chase cam */
export const CAMERA = {
  followBehind: 4,
  height: 6,
  distance: 14,
  lookAhead: 12,
  lookDown: -0.5,
  lerp: 0.07,
  fov: 55,
} as const;

/** vfx timing and visuals for runner sphere */
export const VFX = {
  squashDurationMs: 120,
  squashAmount: 0.2,
  squashStretchX: 0.3,
  stumbleTilt: 0.4,
  stumbleBounce: 0.15,
  stumbleBounceSpeed: 8,
} as const;
