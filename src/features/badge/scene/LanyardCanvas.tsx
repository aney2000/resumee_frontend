import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import type { BadgeContent } from '@/features/badge/badgeContent';
import { CARD_HEIGHT } from './BadgeCard';
import { distanceToFill } from './framing';
import { LanyardScene } from './LanyardScene';

const FOV = 25;
// The badge is the hero's centrepiece, so it fills over half of the stage height.
const CAMERA_Z = distanceToFill(CARD_HEIGHT, 0.55, FOV);

export interface LanyardCanvasProps {
  readonly content: BadgeContent;
  readonly flipped: boolean;
  readonly onFlip: () => void;
}

/** Offline-friendly canvas (no remote HDRs) hosting the physics lanyard badge. */
export function LanyardCanvas({ content, flipped, onFlip }: LanyardCanvasProps) {
  const { name, title } = content.front;
  return (
    <div
      role="img"
      aria-label={`${name}, ${title} — interactive 3D badge`}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas camera={{ position: [0, 0, CAMERA_Z], fov: FOV }} dpr={[1, 2]} gl={{ alpha: true }}>
        <ambientLight intensity={Math.PI / 2} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-5, 2, -5]} intensity={1} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} interpolate>
          <LanyardScene content={content} flipped={flipped} onFlip={onFlip} />
        </Physics>
      </Canvas>
    </div>
  );
}

export default LanyardCanvas;
