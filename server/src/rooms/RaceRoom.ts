/**
 * authoritative race room - ready, countdown, tap, results, rematch
 */

import { Room, Client } from 'colyseus';
import { RaceState, PlayerState } from './schema/RaceState';
import { TUNING } from '../constants/tuning';
import { applyTap, stepRunner, createRunner, type Runner } from '../logic/runnerSim';
import type { TapSide } from '../logic/tapLogic';

const dtFixed = 1 / TUNING.serverTickHz;

export class RaceRoom extends Room<RaceState> {
  private runners = new Map<string, Runner>();

  private toDisplayName(value: unknown): string {
    if (typeof value !== 'string') return 'player';
    const trimmed = value.trim();
    if (!trimmed) return 'player';
    return trimmed.slice(0, 20);
  }

  onCreate() {
    this.setState(new RaceState());
    this.maxClients = 8;
    this.setSimulationInterval(() => this.step(), 1000 * dtFixed);
    this.onMessage('tap', (client, msg: { side: 'L' | 'R'; seq: number; t: number }) => {
      this.handleTap(client, msg);
    });
    this.onMessage('ready', (client, ready: boolean) => {
      const p = this.state.players.get(client.sessionId);
      if (p) {
        p.ready = !!ready;
        this.checkStartCountdown();
      }
    });
    this.onMessage('requestRematch', () => {
      if (this.state.phase === 'RESULTS') {
        this.resetToWaiting();
      }
    });
  }

  onJoin(client: Client, options?: { displayName?: string }) {
    const runner = createRunner();
    this.runners.set(client.sessionId, runner);
    const p = new PlayerState();
    p.displayName = this.toDisplayName(options?.displayName);
    p.x = runner.x;
    p.v = runner.v;
    p.state = runner.state;
    p.expectedSide = runner.expectedSide;
    this.state.players.set(client.sessionId, p);
  }

  onLeave(client: Client) {
    this.runners.delete(client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  private checkStartCountdown() {
    if (this.state.phase !== 'WAITING') return;
    let readyCount = 0;
    this.state.players.forEach((p) => { if (p.ready) readyCount++; });
    if (readyCount >= 2) {
      this.state.phase = 'COUNTDOWN';
      this.state.countdownStartAt = Date.now();
    }
  }

  private resetToWaiting() {
    this.state.phase = 'WAITING';
    this.state.countdownStartAt = 0;
    this.runners.forEach((runner, sessionId) => {
      const r = createRunner();
      runner.x = r.x;
      runner.v = r.v;
      runner.state = r.state;
      runner.expectedSide = r.expectedSide;
      runner.lastTapTime = r.lastTapTime;
      runner.cadenceMs = r.cadenceMs;
      runner.lockUntil = r.lockUntil;
      runner.recoverUntil = r.recoverUntil;
      runner.lastProcessedSeq = r.lastProcessedSeq;
      this.syncPlayerToSchema(sessionId);
    });
    this.state.players.forEach((p) => {
      p.x = 0;
      p.v = 0;
      p.state = 'RUNNING';
      p.ready = false;
      p.placement = 0;
      p.lockUntil = 0;
      p.recoverUntil = 0;
      p.lastProcessedSeq = -1;
    });
  }

  private handleTap(client: Client, msg: { side: 'L' | 'R'; seq: number; t: number }) {
    if (this.state.phase !== 'RUNNING') return;
    const runner = this.runners.get(client.sessionId);
    const pState = this.state.players.get(client.sessionId);
    if (!runner || !pState) return;
    if (msg.seq <= runner.lastProcessedSeq) return;
    runner.lastProcessedSeq = msg.seq;
    const now = Date.now();
    applyTap(runner, msg.side as TapSide, now);
    this.syncPlayerToSchema(client.sessionId);
  }

  private syncPlayerToSchema(sessionId: string) {
    const runner = this.runners.get(sessionId);
    const p = this.state.players.get(sessionId);
    if (!runner || !p) return;
    p.x = runner.x;
    p.v = runner.v;
    p.state = runner.state;
    p.expectedSide = runner.expectedSide;
    p.lastTapTime = runner.lastTapTime ?? 0;
    p.cadenceMs = runner.cadenceMs ?? 0;
    p.lockUntil = runner.lockUntil;
    p.recoverUntil = runner.recoverUntil;
    p.lastProcessedSeq = runner.lastProcessedSeq;
  }

  private step() {
    const now = Date.now();

    if (this.state.phase === 'COUNTDOWN') {
      if (now - this.state.countdownStartAt >= TUNING.countdownMs) {
        this.state.phase = 'RUNNING';
      }
      return;
    }

    if (this.state.phase !== 'RUNNING') return;

    const nowSec = now / 1000;
    for (const [sessionId, runner] of this.runners) {
      stepRunner(runner, dtFixed, now);
      this.syncPlayerToSchema(sessionId);
    }

    let allFinished = true;
    for (const [, runner] of this.runners) {
      if (runner.state !== 'FINISHED') {
        allFinished = false;
        break;
      }
    }
    if (allFinished && this.state.players.size > 0) {
      const sorted = Array.from(this.state.players.entries())
        .sort(([, a], [, b]) => b.x - a.x);
      sorted.forEach(([, p], idx) => {
        p.placement = idx + 1;
      });
      this.state.phase = 'RESULTS';
    }
  }
}
