/**
 * rhythm-sprint tuning - must match client
 */

export const TUNING = {
  trackLength: 100,
  baseImpulse: 0.9,
  impulseFalloff: 0.06,
  drag: 0.9,
  maxSpeed: 12,
  cadenceEmaAlpha: 0.2,
  baseTargetMs: 180,
  minTargetMs: 110,
  timingWindowPct: 0.35,
  stumbleVelocityMultiplier: 0.25,
  stumbleLockMs: 280,
  recoverMs: 900,
  serverTickHz: 30,
  snapshotHz: 10,
  countdownMs: 3000,
} as const;
