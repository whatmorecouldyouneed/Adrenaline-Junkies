/**
 * rhythm / stumble tuning constants - adjust for feel
 */

export const RHYTHM = {
  /** beats per minute - adjust per difficulty */
  bpm: 120,
  /** ms per beat at current bpm */
  get msPerBeat() {
    return 60000 / this.bpm;
  },
  /** hit window: ms before/after perfect to count as hit */
  hitWindowMs: 100,
  /** beats shown ahead in lane */
  beatsVisible: 16,
} as const;

export const STUMBLE = {
  /** duration player is "stumbled" in seconds */
  durationSec: 0.4,
  /** consecutive misses before stumble */
  missThreshold: 2,
  /** beats player has to recover (correct hit) before full speed */
  recoveryBeats: 2,
} as const;
