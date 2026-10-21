import { Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { MathUtils, type Group } from 'three';
import type { LabelVisibility } from '@/features/cv3d/labelVisibility';
import type { Milestone } from '@/features/cv3d/layout';
import { kindColors } from '@/features/cv3d/layout';
import styles from '../Cv3d.module.css';

export interface MilestoneNodeProps {
  readonly milestone: Milestone;
  readonly selected: boolean;
  readonly label: LabelVisibility;
  readonly onSelect: (id: string) => void;
}

const SELECTED_SCALE = 1.3;
const DAMPING = 8;

export function MilestoneNode({ milestone, selected, label, onSelect }: MilestoneNodeProps) {
  const { entry, position } = milestone;
  const color = kindColors[entry.kind];
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hovered]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const target = selected ? SELECTED_SCALE : hovered ? 1.2 : 1;
    node.scale.setScalar(MathUtils.damp(node.scale.x, target, DAMPING, delta));
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(entry.id);
  };

  return (
    <group position={[...position]}>
      <group
        ref={group}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={selected ? 1.8 : 1.2}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={selected ? 0.15 : 0.08}
            depthWrite={false}
          />
        </mesh>
      </group>
      {label === 'full' ? (
        // No distanceFactor: labels keep a constant, readable pixel size at any depth.
        <Html center position={[0, 0.7, 0]} zIndexRange={selected ? [20, 10] : [9, 0]}>
          <span
            className={selected ? `${styles.label} ${styles.labelSelected}` : styles.label}
            style={{ borderLeft: `3px solid ${color}` }}
          >
            {entry.title}
          </span>
        </Html>
      ) : (
        hovered && (
          <Html center position={[0, 0.6, 0]} zIndexRange={[9, 0]}>
            <span className={styles.label} title={entry.title}>
              {entry.title}
            </span>
          </Html>
        )
      )}
    </group>
  );
}
