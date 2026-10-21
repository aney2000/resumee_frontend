import { Sparkles, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type { Milestone } from '@/features/cv3d/layout';
import { cameraTargetFor } from '@/features/cv3d/layout';
import { CameraRig } from './CameraRig';
import { JourneyPath } from './JourneyPath';
import { MilestoneNode } from './MilestoneNode';

export interface JourneyCanvasProps {
  readonly milestones: readonly Milestone[];
  readonly selectedId: string | undefined;
  readonly onSelect: (id: string) => void;
}

/** Offline-friendly 3D journey (no remote fonts or HDRs). */
export function JourneyCanvas({ milestones, selectedId, onSelect }: JourneyCanvasProps) {
  const selected = milestones.find((m) => m.entry.id === selectedId) ?? milestones[0];
  const focus = selected?.position ?? ([0, 0, 0] as const);

  return (
    <div
      role="img"
      aria-label="Interactive 3D journey of career milestones"
      style={{ position: 'absolute', inset: 0 }}
    >
      <Canvas
        camera={{ position: [...cameraTargetFor(focus).position], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 5, 5]} intensity={20} />
        <Stars radius={60} depth={40} count={1500} factor={3} fade speed={0.5} />
        <Sparkles
          count={60}
          scale={[12, 6, milestones.length * 3 + 6]}
          size={2}
          speed={0.3}
          opacity={0.5}
        />
        <JourneyPath milestones={milestones} />
        {milestones.map((milestone) => (
          <MilestoneNode
            key={milestone.entry.id}
            milestone={milestone}
            selected={milestone.entry.id === selected?.entry.id}
            onSelect={onSelect}
          />
        ))}
        <CameraRig focus={focus} />
      </Canvas>
    </div>
  );
}

export default JourneyCanvas;
