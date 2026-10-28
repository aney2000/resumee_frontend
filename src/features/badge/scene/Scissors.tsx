import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { Vec3 } from './dragMath';
import { SCISSORS_DURATION_SECONDS, scissorsPose, SNIP_AT } from './scissorsMotion';

export interface ScissorsProps {
  /** World position of the cut point, read every frame; undefined while it is not ready. */
  readonly target: () => Vec3 | undefined;
  readonly onSnip: () => void;
}

const BLADE_LENGTH = 0.9;
// The blades meet the lanyard near their middle, not at the pivot screw.
const PIVOT_TO_CUT = BLADE_LENGTH * 0.55;
const STEEL = { color: '#c0c0c8', metalness: 0.9, roughness: 0.25 } as const;
const HANDLE_COLOR = '#22d3ee';

function ScissorsHalf({ side }: { readonly side: 1 | -1 }) {
  return (
    <>
      <mesh position={[-BLADE_LENGTH / 2, 0, side * 0.012]}>
        <boxGeometry args={[BLADE_LENGTH, 0.07, 0.02]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0.18, side * 0.06, side * 0.012]} rotation={[0, 0, side * 0.35]}>
        <boxGeometry args={[0.3, 0.06, 0.02]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0.42, side * 0.16, 0]}>
        <torusGeometry args={[0.14, 0.035, 12, 24]} />
        <meshStandardMaterial color={HANDLE_COLOR} roughness={0.4} />
      </mesh>
    </>
  );
}

/** Procedural scissors that fly to the lanyard, snip it once and fly away. */
export function Scissors({ target, onSnip }: ScissorsProps) {
  const root = useRef<Group>(null);
  const upper = useRef<Group>(null);
  const lower = useRef<Group>(null);
  const elapsed = useRef(0);
  const snipped = useRef(false);

  useFrame((_, delta) => {
    const cut = target();
    if (!cut || !root.current || !upper.current || !lower.current) return;
    elapsed.current += delta;
    const progress = elapsed.current / SCISSORS_DURATION_SECONDS;
    const { offset, opening } = scissorsPose(progress);
    root.current.position.set(cut.x + offset.x + PIVOT_TO_CUT, cut.y + offset.y, cut.z + offset.z);
    upper.current.rotation.z = opening;
    lower.current.rotation.z = -opening;
    if (!snipped.current && progress >= SNIP_AT) {
      snipped.current = true;
      onSnip();
    }
  });

  return (
    <group ref={root} rotation={[0, -0.35, 0]}>
      <group ref={upper}>
        <ScissorsHalf side={1} />
      </group>
      <group ref={lower}>
        <ScissorsHalf side={-1} />
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}
