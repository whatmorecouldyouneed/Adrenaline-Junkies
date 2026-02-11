/**
 * 3d scene: track + runner sphere(s)
 * single-player: runnerStore | multiplayer: prediction (local) + interpolated (remote)
 */

import React, { useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { TUNING, CAMERA } from '../../constants/tuning';
import { useRunnerStore } from '../../stores/runnerStore';
import { useMultiplayerPredictionStore } from '../../stores/multiplayerPredictionStore';
import { CameraRig } from './CameraRig';
import { RunnerSphereVfx } from './RunnerSphereVfx';
import { Track } from './Track';
import type { Room } from 'colyseus.js';

type SceneRootProps = { room?: Room | null };

const RUNNER_COLORS = [0xeaf205, 0x00d4ff, 0xff6b6b, 0x69db7c];


function SinglePlayerRunner() {
  const step = useRunnerStore((s) => s.step);

  useFrame((_, delta) => {
    step(delta, performance.now());
  });

  const getState = () => {
    const { runner, lastValidTapAt } = useRunnerStore.getState();
    return { x: runner.x, state: runner.state, lastValidTapAt };
  };
  return <RunnerSphereVfx laneY={0} color={RUNNER_COLORS[0]} getState={getState} />;
}

function MultiPlayerRunners({ room }: { room: Room }) {
  const [, forceUpdate] = useState(0);
  const step = useMultiplayerPredictionStore((s) => s.step);
  const getInterpolated = useMultiplayerPredictionStore((s) => s.getInterpolatedRemote);

  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    room.onStateChange(handler);
    return () => room.onStateChange.remove(handler);
  }, [room]);

  const sessionId = room.sessionId;
  const playerIds: string[] = [];
  room.state.players.forEach((_: unknown, id: string) => playerIds.push(id));

  return (
    <>
      {playerIds.map((id, idx) => {
        const isLocal = id === sessionId;
        const laneY = idx;

        if (isLocal) {
          return <MultiLocalRunner key={id} laneY={laneY} step={step} />;
        }

        const getState = () => {
          const interp = getInterpolated(id, performance.now());
          return { x: interp?.x ?? 0, state: interp?.state ?? 'RUNNING' };
        };
        return (
          <RunnerSphereVfx
            key={id}
            laneY={laneY}
            color={RUNNER_COLORS[idx % RUNNER_COLORS.length]}
            getState={getState}
          />
        );
      })}
    </>
  );
}

function MultiLocalRunner({
  laneY,
  step,
}: {
  laneY: number;
  step: (dt: number, now: number) => void;
}) {
  useFrame((_, delta) => {
    step(delta, performance.now());
  });

  const getState = () => {
    const { predictedRunner, lastValidTapAt } = useMultiplayerPredictionStore.getState();
    return {
      x: predictedRunner.x,
      state: predictedRunner.state,
      lastValidTapAt,
    };
  };
  return <RunnerSphereVfx laneY={laneY} color={RUNNER_COLORS[0]} getState={getState} />;
}

export function SceneRoot({ room }: SceneRootProps) {
  return (
    <Canvas style={{ flex: 1 }} camera={{ position: [0, CAMERA.height, CAMERA.distance], fov: CAMERA.fov }} gl={{ antialias: true }} shadows>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
      <CameraRig room={room} />
      <Track />
      {room ? <MultiPlayerRunners room={room} /> : <SinglePlayerRunner />}
    </Canvas>
  );
}
