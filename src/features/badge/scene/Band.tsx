import { useMemo, useRef, type RefObject } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { CatmullRomCurve3, Vector2, Vector3 } from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

const ACCENT_VIOLET = '#8b5cf6';
const CURVE_SEGMENTS = 32;

export interface BandProps {
  /** Bodies the band passes through, from the card end to the anchor. */
  readonly bodies: readonly RefObject<RapierRigidBody>[];
}

/** Lanyard strap drawn as a MeshLine along a curve through the rope bodies. */
export function Band({ bodies }: BandProps) {
  const geometry = useRef<MeshLineGeometry>(null);
  const size = useThree((state) => state.size);
  const resolution = useMemo(() => new Vector2(size.width, size.height), [size]);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        bodies.map(() => new Vector3()),
        false,
        'chordal',
      ),
    [bodies],
  );

  useFrame(() => {
    if (!geometry.current) return;
    for (let i = 0; i < bodies.length; i += 1) {
      const body = bodies[i]?.current;
      const point = curve.points[i];
      if (!body || !point) return;
      point.copy(body.translation());
    }
    geometry.current.setPoints(curve.getPoints(CURVE_SEGMENTS));
  });

  return (
    <mesh>
      <meshLineGeometry ref={geometry} />
      <meshLineMaterial
        color={ACCENT_VIOLET}
        lineWidth={0.12}
        resolution={resolution}
        depthTest={false}
      />
    </mesh>
  );
}
