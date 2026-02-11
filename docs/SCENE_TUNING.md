# Scene tuning

## Camera (Temple Run / Subway Surfers style)

Edit `src/constants/tuning.ts` → `CAMERA`:

| param | effect |
|-------|--------|
| `followBehind` | units behind runner on track (higher = more lag) |
| `height` | camera height above track |
| `distance` | depth / zoom (higher = further back) |
| `lookAhead` | how far ahead camera aims |
| `lookDown` | downward angle (negative = look slightly down) |
| `lerp` | follow smoothness (0.05 = sluggish, 0.12 = snappy) |
| `fov` | field of view (55–60 typical for runner games) |

## Track

- `assets/track.fbx` is loaded when available; falls back to plane on error.
- To swap formats later: convert track to `.glb`, add to `assetExts`, and update `Track.tsx` to use `useGLTF` instead of `useFBX`.
- Track position/scale: `TrackFbx` centers at `TUNING.trackLength/2`. If the FBX has different proportions, add scale in `Track.tsx`.

## VFX (squash, stumble)

Edit `src/constants/tuning.ts` → `VFX`:

| param | effect |
|-------|--------|
| `squashDurationMs` | how long squash-on-tap lasts |
| `stumbleTilt` | forward tilt when stumbling |
| `stumbleBounce` | vertical bounce height |
| `stumbleBounceSpeed` | bounce animation speed |
