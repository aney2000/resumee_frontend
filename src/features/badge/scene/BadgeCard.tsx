import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { MathUtils, type Group } from 'three';
import type { BadgeTextures } from './useBadgeTextures';

export const CARD_WIDTH = 1.5;
export const CARD_HEIGHT = 2.25;
export const CARD_DEPTH = 0.04;
const FACE_OFFSET = CARD_DEPTH / 2 + 0.001;
const FLIP_DAMPING = 8;

export interface BadgeCardProps {
  readonly textures: BadgeTextures;
  readonly flipped: boolean;
}

/** Procedural badge card with printed faces; eases its Y rotation towards the flip target. */
export function BadgeCard({ textures, flipped }: BadgeCardProps) {
  const pivot = useRef<Group>(null);

  useFrame((_, delta) => {
    const group = pivot.current;
    if (!group) return;
    const target = flipped ? Math.PI : 0;
    group.rotation.y = MathUtils.damp(group.rotation.y, target, FLIP_DAMPING, delta);
  });

  return (
    <group ref={pivot}>
      <RoundedBox args={[CARD_WIDTH, CARD_HEIGHT, CARD_DEPTH]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial color="#1e1b2e" roughness={0.4} clearcoat={0.6} />
      </RoundedBox>
      <mesh position={[0, 0, FACE_OFFSET]}>
        <planeGeometry args={[CARD_WIDTH * 0.96, CARD_HEIGHT * 0.96]} />
        <meshPhysicalMaterial map={textures.front} roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0, -FACE_OFFSET]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH * 0.96, CARD_HEIGHT * 0.96]} />
        <meshPhysicalMaterial map={textures.back} roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, CARD_HEIGHT / 2 + 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.025, 12, 24]} />
        <meshStandardMaterial color="#c0c0c8" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}
