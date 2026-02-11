/**
 * shared runner sphere with vfx - squash on tap, tilt+bounce on stumble
 * single source of truth for sphere geometry and animation logic
 * getState called every frame for smooth updates from store/interpolation
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { VFX } from '../../constants/tuning';

const SPHERE_RADIUS = 0.5;
const SPHERE_SEGS = 32;

export type RunnerStateSnapshot = {
  x: number;
  state: string;
  lastValidTapAt?: number;
};

export type RunnerSphereVfxProps = {
  laneY: number;
  color: number;
  getState: () => RunnerStateSnapshot;
};

function computeSquash(now: number, lastValidTapAt?: number) {
  if (lastValidTapAt == null) return { scaleX: 1, scaleY: 1 };
  const sinceTap = now - lastValidTapAt;
  const squash =
    sinceTap < VFX.squashDurationMs
      ? 1 - VFX.squashAmount * (1 - sinceTap / VFX.squashDurationMs)
      : 1;
  return {
    scaleX: 1 + (1 - squash) * VFX.squashStretchX,
    scaleY: squash,
  };
}

export function RunnerSphereVfx({ laneY, color, getState }: RunnerSphereVfxProps) {
  const meshRef = useRef<any>(null);
  const bounceRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const now = performance.now();
    const { x, state, lastValidTapAt } = getState();

    meshRef.current.position.x = x;

    const { scaleX, scaleY } = computeSquash(now, lastValidTapAt);
    meshRef.current.scale.set(scaleX, scaleY, scaleX);

    let rotX = 0;
    let bounceY = 0;
    if (state === 'STUMBLE') {
      rotX = VFX.stumbleTilt;
      bounceRef.current = Math.min(1, bounceRef.current + delta * VFX.stumbleBounceSpeed);
      bounceY = Math.sin(bounceRef.current * Math.PI) * VFX.stumbleBounce;
    } else {
      bounceRef.current = 0;
    }
    meshRef.current.rotation.x = rotX;
    meshRef.current.position.y = 1 + laneY * 2 + bounceY;
  });

  return (
    <mesh ref={meshRef} position={[0, 1 + laneY * 2, 0]} castShadow receiveShadow>
      <sphereGeometry args={[SPHERE_RADIUS, SPHERE_SEGS, SPHERE_SEGS]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
