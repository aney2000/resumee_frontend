import type { Vec3 } from './dragMath';

export interface ScissorsPose {
  /** Position relative to the cut point on the lanyard. */
  readonly offset: Vec3;
  /** Angle of each blade away from closed, in radians. */
  readonly opening: number;
}

export const SCISSORS_DURATION_SECONDS = 1.4;
/** Progress at which the scissors have reached the lanyard. */
const ARRIVE_AT = 0.3;
/** Progress at which the blades close and the lanyard is cut. */
export const SNIP_AT = 0.5;
const OPEN_ANGLE = 0.45;
const AT_LANYARD: Vec3 = { x: 0, y: 0, z: 0 };
const ENTRY: Vec3 = { x: 3.5, y: 1.5, z: 1 };
const EXIT: Vec3 = { x: 3.5, y: 3, z: 1 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smoothstep = (k: number) => k * k * (3 - 2 * k);
const scale = ({ x, y, z }: Vec3, k: number): Vec3 => ({ x: x * k, y: y * k, z: z * k });

/** Choreography of the scissors over a 0..1 progress: fly in open, snip, fly away closed. */
export function scissorsPose(progress: number): ScissorsPose {
  const t = clamp01(progress);
  if (t < ARRIVE_AT) {
    return { offset: scale(ENTRY, 1 - smoothstep(t / ARRIVE_AT)), opening: OPEN_ANGLE };
  }
  if (t < SNIP_AT) {
    const closing = smoothstep((t - ARRIVE_AT) / (SNIP_AT - ARRIVE_AT));
    return { offset: AT_LANYARD, opening: OPEN_ANGLE * (1 - closing) };
  }
  return { offset: scale(EXIT, smoothstep((t - SNIP_AT) / (1 - SNIP_AT))), opening: 0 };
}
