# RN-only MVP Plan: Rhythm-Sprint Multiplayer

> Goals: implement with minimal complexity, prioritize correctness and a shippable loop.

---

## 1. Tech Stack Validation

| Component | Stack | Verdict | Notes |
|-----------|-------|---------|-------|
| 3D/rhythm viewport | `@react-three/fiber/native` + `expo-gl` | ✅ **Valid** | R3F v8+ supports RN; use `@react-three/fiber/native` + `expo-gl`, `expo-asset`. Works with Expo SDK 54. |
| Multiplayer | Colyseus | ✅ **Valid** | JS/TS SDK works with RN. Requires `buffer` + `AsyncStorage` polyfill for `localStorage`. |
| App shell | Expo 54 + RN 0.76 | ✅ **In place** | Already configured. |

**Summary:** Stack is viable for a fast MVP. R3F+expo-gl on RN is "possible but challenging" — expect 1–2 days of setup and platform quirks. Colyseus is straightforward.

**Recommendation:** Keep the stack. Add a **2D fallback** for early playtesting: render a simple rhythm lane (SVG or `Animated` views) before wiring 3D. This reduces risk and speeds up the core loop.

---

## 2. Five Highest-Risk Integration Points

### 2.1 R3F/Three.js on iOS Simulator

**Risk:** iOS simulators have poor/incomplete OpenGL ES support → crashes.

**Simpler alternative:** Test on physical iOS device only. For dev, use Android emulator or web target first.

---

### 2.2 Colyseus + RN: `Buffer` / `localStorage` Polyfills

**Risk:** Colyseus JS client expects `Buffer` and `localStorage`; RN does not provide them.

**Simpler alternative:** Add at app entry (e.g. `index.ts` or `App.tsx`):

Add at the **top** of `index.ts`, before `registerRootComponent`:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
if (typeof global.localStorage === 'undefined') {
  (global as any).localStorage = AsyncStorage;
}
(global as any).Buffer = Buffer;
```

---

### 2.3 Rhythm Timing + Network Latency

**Risk:** Client-side rhythm logic vs server ticks can desync; hit detection becomes unfair or "feels off".

**Simpler alternative:** Server-authoritative timing. Server owns beat grid, `tick`, and hit windows. Client sends input timestamps; server validates in fixed windows. No client-predicted hit resolution for MVP.

---

### 2.4 WebSocket / Colyseus Connection in RN

**Risk:** RN WebSocket differences, background behavior, or firewalls can break connections.

**Simpler alternative:** Use Colyseus built-in reconnection. Start with `ws://` in dev; production needs `wss://`. Add a simple connection status UI (connected/connecting/disconnected) early.

---

### 2.5 expo-gl + Metro Asset Resolution

**Risk:** `useLoader`, `useGLTF`, `useTexture` fail if Metro doesn’t know `.glb`, `.gltf`, `.png`, etc.

**Simpler alternative:** Extend `metro.config.js`:

```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs', 'mjs');
config.resolver.assetExts.push('glb', 'gltf', 'png', 'jpg');
module.exports = config;
```

For MVP, prefer inlined geometry (boxes, planes) over GLB models to reduce loader issues.

---

## 3. Step-by-Step Implementation Order (File-Level)

Match the existing `src/` layout and navigation; integrate Game screen into the flow.

| Phase | Task | Files |
|-------|------|-------|
| **1 – Colyseus shell** | Add Colyseus deps + polyfills; create client singleton | `package.json`, `index.ts` or `App.tsx`, `src/services/colyseus.ts` |
| **2 – Colyseus room schema** | Define server room schema (players, beat index, state) | New: `server/` project or separate repo; schema in `schema/RaceRoom.ts` |
| **3 – Lobby / join flow** | UI to create/join room; connect to Colyseus | `src/screens/LobbyScreen.tsx`, `src/services/colyseus.ts`, `App.tsx` |
| **4 – 2D rhythm lane (MVP)** | Tap lane + beat markers; server-authoritative hit check | `src/screens/GameScreen.tsx`, `src/components/RhythmLane2D.tsx`, `src/constants/rhythm.ts` |
| **5 – Sprint / stumble logic** | Stamina, stumble state, recovery on correct hit | `src/logic/sprintLogic.ts`, schema updates |
| **6 – R3F native setup** | Install R3F native + expo-gl; minimal Canvas | `package.json`, `metro.config.js`, `src/components/GameCanvas.tsx` |
| **7 – 3D race view (optional)** | Replace 2D lane with 3D lane or runner view | `src/components/RhythmLane3D.tsx` |
| **8 – Results sync** | Send final results to Colyseus; show on Results screen | `src/screens/ResultsScreen.tsx`, `src/services/colyseus.ts` |
| **9 – Firebase + Colyseus** | Link Firebase auth user to Colyseus session | `src/services/auth.ts`, `src/services/colyseus.ts` |

### Navigation Additions

- Add `Lobby` and `Game` to `types/navigation.ts`.
- Add screens to `App.tsx` stack.
- Wire `CharacterCreator` / `Lore` → `Lobby` → `Game` → `Results`.

---

## 4. Stumble / Recovery Tuning (Quick Wins)

Goal: Make stumble and recovery feel responsive and fair.

| Parameter | Suggested Range | Effect |
|-----------|-----------------|--------|
| **Stumble duration** | 0.3–0.6 s | Too short = frantic; too long = punishing. Start ~0.4 s. |
| **Recovery window after stumble** | 1–2 beats | Give player a clear window to “get back in rhythm.” |
| **Miss → stumble threshold** | 1–2 misses | 1 miss = more forgiving; 2 = more strategic. |
| **Recovery hit bonus** | Slight speed boost or score multiplier | Rewards “coming back” and feels rewarding. |
| **Visual/audio feedback** | Shake + desat + muffled beat | Stumble feels distinct; recovery = clear sound/visual return. |
| **Input buffer** | ~80–120 ms early acceptance | Reduces perceived input lag; server validates in hit window. |

**Implementation sketch:**
- Server: `state.stumbledAtBeat`, `state.recoveryUntilBeat`.
- Client: interpolate stumble animation and recovery state from server state.
- Tune via `src/constants/rhythm.ts` (client) and equivalent server constants.

---

## 5. Authoritative Server & Snapshot Strategy

### Simplest Authoritative Model

- **Server owns:** beat index, tick rate, player positions, stamina, stumble/recovery, hit results.
- **Client sends:** tap/hit input with local timestamp (for ordering only).
- **Server validates:** hit within window for current beat; updates stamina/stumble; broadcasts patches.

### Snapshot Strategy

1. **Initial state:** Full room state on join (Colyseus default).
2. **Patch rate:** 50 ms (Colyseus default). For rhythm, 20 Hz is fine; 30–50 ms is common.
3. **Schema shape:** Keep it flat for MVP:
   - `players: MapSchema<PlayerState>` (id, lanePosition, stamina, isStumbled, lastHitBeat)
   - `beatIndex: number`
   - `phase: string` (`"countdown" | "racing" | "finished"`)

### Server Placement

- **Option A (simplest):** Standalone Node.js Colyseus server in `server/` or separate repo. Run via `node index.js`.
- **Option B:** Colyseus on a cloud host (Railway, Render, Fly.io) with WebSocket support.
- **Deploy:** Use `colyseus deploy` or Docker for production.

---

## 6. Actionable Checklist + Code Skeletons

### Checklist

- [ ] `yarn add colyseus.js buffer`; apply polyfills in `index.ts` (see Risk #2)
- [ ] Extend `metro.config.js` for glb/gltf
- [ ] Create `src/services/colyseus.ts` singleton
- [ ] Add `Lobby` and `Game` to navigation + `App.tsx`
- [ ] Create `LobbyScreen` (create/join room)
- [ ] Create `GameScreen` with 2D rhythm lane
- [ ] Implement `RhythmLane2D` (beats + taps)
- [ ] Implement server room schema + hit validation
- [ ] Implement stumble/recovery in schema + client
- [ ] Add connection status UI
- [ ] (Optional) Add R3F native + `GameCanvas`
- [ ] (Optional) Replace 2D lane with 3D
- [ ] Wire Results screen to Colyseus room state
- [ ] Link Firebase auth to Colyseus join

### Code Skeletons

#### `src/services/colyseus.ts`

```ts
import { Client } from 'colyseus.js';

const WS_URL = process.env.EXPO_PUBLIC_COLYSEUS_URL || 'ws://localhost:2567';
export const colyseusClient = new Client(WS_URL);

export type RoomPhase = 'countdown' | 'racing' | 'finished';

export async function createRaceRoom(): Promise<string> {
  const room = await colyseusClient.create('race_room', {});
  return room.id;
}

export async function joinRaceRoom(roomId: string) {
  return colyseusClient.joinById(roomId);
}
```

#### `src/components/RhythmLane2D.tsx` (minimal)

```tsx
import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

const BEAT_COUNT = 16;
const LANE_HEIGHT = 60;

export function RhythmLane2D({
  beatIndex,
  onTap,
}: {
  beatIndex: number;
  onTap: (beat: number) => void;
}) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      {Array.from({ length: BEAT_COUNT }, (_, i) => (
        <TouchableWithoutFeedback key={i} onPress={() => onTap(i)}>
          <View
            style={{
              height: LANE_HEIGHT,
              backgroundColor: i === beatIndex ? '#EAF205' : '#1a1a3e',
              marginVertical: 2,
            }}
          />
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}
```

#### Server room schema (Colyseus)

```ts
// server/src/rooms/RaceRoom.ts (or equivalent)
import { Room, Client } from 'colyseus';
import { Schema, type, MapSchema } from '@colyseus/schema';

class PlayerState extends Schema {
  @type('number') lanePosition = 0;
  @type('number') stamina = 100;
  @type('boolean') isStumbled = false;
  @type('number') lastHitBeat = -1;
}

class RaceState extends Schema {
  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type('number') beatIndex = 0;
  @type('string') phase = 'countdown';
}

export class RaceRoom extends Room<RaceState> {
  onCreate() {
    this.setState(new RaceState());
    this.setSimulationInterval((dt) => this.update(dt), 50);
  }

  update(dt: number) {
    // advance beat index, check hit windows, update stamina
  }

  onMessage(client: Client, message: { type: 'hit'; beat: number }) {
    // validate hit, update player state
  }
}
```

---

## Summary

| Area | Action |
|------|--------|
| **Tech stack** | Keep R3F native + expo-gl + Colyseus; use 2D rhythm lane first for speed. |
| **Risk mitigation** | Polyfills, Metro config, physical iOS testing, server-authoritative timing. |
| **Implementation order** | Colyseus → Lobby → 2D Game → stumble/recovery → optional 3D. |
| **Stumble feel** | 0.4 s stumble, 1–2 beat recovery window, strong visual/audio feedback. |
| **Server** | Flat schema, 50 ms patch rate, server validates all hits. |
