/**
 * track mesh - uses track.fbx when available, plane fallback
 * future: swap assets/track.fbx for other formats (glb) without changing this api
 * scale/position may need tuning per asset - see TUNING.trackLength
 */

import React, { useState, useEffect } from 'react';
import { useFBX } from '@react-three/drei/native';
import { TUNING } from '../../constants/tuning';
import { Asset } from 'expo-asset';

const TRACK_COLOR = 0x1a1a3e;

function TrackPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[TUNING.trackLength / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[TUNING.trackLength, 20]} />
      <meshStandardMaterial color={TRACK_COLOR} />
    </mesh>
  );
}

function TrackFbx({ uri }: { uri: string }) {
  const fbx = useFBX(uri);
  return (
    <primitive
      object={fbx}
      position={[TUNING.trackLength / 2, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  );
}

class TrackErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError = () => ({ hasError: true });
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function Track() {
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Asset.fromModule(require('../../../assets/track.fbx'))
      .downloadAsync()
      .then((asset) => {
        if (!cancelled && asset.localUri) setUri(asset.localUri);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, []);

  if (error || !uri) return <TrackPlane />;

  return (
    <TrackErrorBoundary fallback={<TrackPlane />}>
      <React.Suspense fallback={<TrackPlane />}>
        <TrackFbx uri={uri} />
      </React.Suspense>
    </TrackErrorBoundary>
  );
}
