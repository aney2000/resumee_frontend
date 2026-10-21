import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { Vector3 } from 'three';
import { cameraTargetFor, type Vec3 } from '@/features/cv3d/layout';

export interface CameraRigProps {
  readonly focus: Vec3;
}

const DAMPING = 2.5;

/** Flies the camera toward the focused milestone with frame-rate independent damping. */
export function CameraRig({ focus }: CameraRigProps) {
  const camera = useThree((state) => state.camera);
  const lookAt = useRef(new Vector3(...focus));
  const desired = useRef(new Vector3());
  const desiredLook = useRef(new Vector3());

  useFrame((_, delta) => {
    const target = cameraTargetFor(focus);
    const alpha = 1 - Math.exp(-DAMPING * delta);
    desired.current.set(...target.position);
    desiredLook.current.set(...target.lookAt);
    camera.position.lerp(desired.current, alpha);
    lookAt.current.lerp(desiredLook.current, alpha);
    camera.lookAt(lookAt.current);
  });

  return null;
}
