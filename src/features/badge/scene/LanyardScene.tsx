import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier';
import { Vector3 } from 'three';
import type { BadgeContent } from '@/features/badge/badgeContent';
import type { BadgePhase } from '@/features/badge/badgeLifecycle';
import { BadgeCard, CARD_DEPTH, CARD_HEIGHT, CARD_WIDTH } from './BadgeCard';
import { Band } from './Band';
import { computeDragTarget, isClick, type Vec2, type Vec3 } from './dragMath';
import { Scissors } from './Scissors';
import { useBadgeTextures } from './useBadgeTextures';
import { useTouchScrollGuard } from './useTouchScrollGuard';

// Mirrors rapier's RigidBodyType enum; rapier3d-compat is only a transitive dependency.
const BODY_TYPE = { dynamic: 0, kinematicPosition: 2 } as const;
const SEGMENT_LENGTH = 1;
const CARD_TOP: [number, number, number] = [0, CARD_HEIGHT / 2 + 0.08, 0];
// Far enough below the stage that the scissors finish flying away before a fresh badge arrives.
const FALL_OUT_Y = -12;
const SEGMENT_PROPS: RigidBodyProps = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  linearDamping: 4,
  angularDamping: 4,
};

interface PressState {
  readonly offset: Vec3;
  readonly downPos: Vec2;
  readonly downTime: number;
}

export interface LanyardSceneProps {
  readonly content: BadgeContent;
  readonly flipped: boolean;
  readonly phase: BadgePhase;
  readonly onFlip: () => void;
  readonly onSnip: () => void;
  readonly onFellOut: () => void;
}

function useRope(
  fixed: RefObject<RapierRigidBody>,
  j1: RefObject<RapierRigidBody>,
  j2: RefObject<RapierRigidBody>,
  j3: RefObject<RapierRigidBody>,
): void {
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEGMENT_LENGTH]);
}

interface CardClipProps {
  readonly lanyard: RefObject<RapierRigidBody>;
  readonly card: RefObject<RapierRigidBody>;
}

// A component rather than a hook so the joint can be removed by unmounting it. It must render
// after the rigid bodies: their effects create the bodies before this one creates the joint.
function CardClip({ lanyard, card }: CardClipProps) {
  useSphericalJoint(lanyard, card, [[0, 0, 0], CARD_TOP]);
  return null;
}

/** Vercel-lanyard-style rope physics: anchor, three rope segments and a draggable card. */
export function LanyardScene({
  content,
  flipped,
  phase,
  onFlip,
  onSnip,
  onFellOut,
}: LanyardSceneProps) {
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const [press, setPress] = useState<PressState | null>(null);
  // Read synchronously by the touch guard; state would lag one render behind the finger.
  const dragging = useRef(false);
  const isDragging = useCallback(() => dragging.current, []);
  const canvas = useThree((state) => state.gl.domElement);
  const pointerWorld = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);
  const bandBodies = useMemo(() => [j3, j2, j1, fixed], []);
  const lanyardEnd = useCallback(() => j3.current?.translation(), []);
  const textures = useBadgeTextures(content);
  const cut = phase === 'falling';

  useRope(fixed, j1, j2, j3);
  useTouchScrollGuard(canvas, isDragging);

  useEffect(() => {
    const body = card.current;
    if (!cut || !body) return;
    dragging.current = false;
    setPress(null);
    body.setBodyType(BODY_TYPE.dynamic, true);
    // The rope damping would turn the drop into a slow glide.
    body.setLinearDamping(0);
  }, [cut]);

  useFrame(({ pointer, camera }) => {
    const body = card.current;
    if (cut && body && body.translation().y < FALL_OUT_Y) onFellOut();
    if (!press || !body) return;
    pointerWorld.set(pointer.x, pointer.y, 0.5).unproject(camera);
    direction.copy(pointerWorld).sub(camera.position).normalize();
    pointerWorld.copy(camera.position).addScaledVector(direction, camera.position.length());
    body.setNextKinematicTranslation(computeDragTarget(pointerWorld, press.offset));
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    const body = card.current;
    if (!body || cut) return;
    event.stopPropagation();
    (event.target as Element | null)?.setPointerCapture?.(event.pointerId);
    const position = body.translation();
    dragging.current = true;
    setPress({
      offset: {
        x: event.point.x - position.x,
        y: event.point.y - position.y,
        z: event.point.z - position.z,
      },
      downPos: { x: event.clientX, y: event.clientY },
      downTime: performance.now(),
    });
    body.setBodyType(BODY_TYPE.kinematicPosition, true);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    dragging.current = false;
    if (!press) return;
    (event.target as Element | null)?.releasePointerCapture?.(event.pointerId);
    card.current?.setBodyType(BODY_TYPE.dynamic, true);
    const upPos = { x: event.clientX, y: event.clientY };
    if (isClick(press.downPos, upPos, press.downTime, performance.now())) onFlip();
    setPress(null);
  };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEGMENT_PROPS} type="fixed" />
        <RigidBody ref={j1} position={[0.5, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} position={[1, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} position={[1.5, 0, 0]} {...SEGMENT_PROPS}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={card} position={[2, -1.5, 0]} {...SEGMENT_PROPS}>
          <CuboidCollider args={[CARD_WIDTH / 2, CARD_HEIGHT / 2, CARD_DEPTH / 2]} />
          <group
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <BadgeCard textures={textures} flipped={flipped} />
          </group>
        </RigidBody>
      </group>
      {!cut && <CardClip lanyard={j3} card={card} />}
      {phase !== 'attached' && <Scissors target={lanyardEnd} onSnip={onSnip} />}
      <Band bodies={bandBodies} />
    </>
  );
}
