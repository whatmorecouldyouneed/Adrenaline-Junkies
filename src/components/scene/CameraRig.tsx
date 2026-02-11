/**
 * temple run / subway surfers style chase camera
 * behind, above, looking down the track - tuned via CAMERA constants
 */

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber/native';
import { useRunnerStore } from '../../stores/runnerStore';
import { useMultiplayerPredictionStore } from '../../stores/multiplayerPredictionStore';
import { CAMERA } from '../../constants/tuning';
import type { Room } from 'colyseus.js';

export function CameraRig({ room }: { room?: Room | null }) {
  const { camera } = useThree();
  const posRef = useRef({
    x: -CAMERA.followBehind,
    y: CAMERA.height,
    z: CAMERA.distance,
  });

  useFrame(() => {
    const runnerX = room
      ? useMultiplayerPredictionStore.getState().predictedRunner.x
      : useRunnerStore.getState().runner.x;

    const targetX = runnerX - CAMERA.followBehind;
    const targetY = CAMERA.height;
    const targetZ = CAMERA.distance;

    posRef.current.x += (targetX - posRef.current.x) * CAMERA.lerp;
    posRef.current.y += (targetY - posRef.current.y) * CAMERA.lerp;
    posRef.current.z += (targetZ - posRef.current.z) * CAMERA.lerp;

    camera.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
    camera.lookAt(
      runnerX + CAMERA.lookAhead,
      CAMERA.lookDown,
      0
    );
  });

  return null;
}
