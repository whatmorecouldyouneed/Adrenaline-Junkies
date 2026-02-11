/**
 * tap event buffer - { side, seq, time }[]
 * used for client prediction + server replay
 */

import type { TapSide } from './tapLogic';

export type TapEvent = {
  side: TapSide;
  seq: number;
  time: number;
};

export type InputBuffer = {
  push: (side: TapSide, time: number) => TapEvent;
  getPending: (afterSeq: number) => TapEvent[];
  pruneUpTo: (seq: number) => void;
  clear: () => void;
};

export function createInputBuffer(): InputBuffer {
  const buffer: TapEvent[] = [];
  let nextSeq = 0;

  return {
    push(side: TapSide, time: number): TapEvent {
      const event: TapEvent = { side, seq: nextSeq++, time };
      buffer.push(event);
      return event;
    },
    getPending(afterSeq: number): TapEvent[] {
      return buffer.filter((e) => e.seq > afterSeq);
    },
    pruneUpTo(seq: number) {
      while (buffer.length && buffer[0].seq <= seq) {
        buffer.shift();
      }
    },
    clear() {
      buffer.length = 0;
      nextSeq = 0;
    },
  };
}
