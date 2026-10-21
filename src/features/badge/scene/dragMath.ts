export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Vec2 {
  readonly x: number;
  readonly y: number;
}

export interface ClickThresholds {
  /** Max pointer travel in CSS pixels for a press to count as a click. */
  readonly maxDistance: number;
  /** Max press duration in milliseconds for a press to count as a click. */
  readonly maxDuration: number;
}

export const DEFAULT_CLICK_THRESHOLDS: ClickThresholds = { maxDistance: 6, maxDuration: 350 };

/** Where the dragged body should go so the grabbed point stays under the pointer. */
export function computeDragTarget(pointer: Vec3, offset: Vec3): Vec3 {
  return { x: pointer.x - offset.x, y: pointer.y - offset.y, z: pointer.z - offset.z };
}

/** A press is a click when it is short and the pointer barely moved; otherwise it is a drag. */
export function isClick(
  downPos: Vec2,
  upPos: Vec2,
  downTime: number,
  upTime: number,
  thresholds: ClickThresholds = DEFAULT_CLICK_THRESHOLDS,
): boolean {
  const duration = upTime - downTime;
  if (duration < 0 || duration > thresholds.maxDuration) return false;
  return Math.hypot(upPos.x - downPos.x, upPos.y - downPos.y) <= thresholds.maxDistance;
}

/** Target Y rotation after a flip: front (0) becomes back (PI) and vice versa. */
export function nextFlipRotation(current: number): number {
  const showingBack = Math.abs(current - Math.PI) < Math.abs(current);
  return showingBack ? 0 : Math.PI;
}

/** Frame-rate friendly easing towards a target angle. */
export function smoothedRotation(current: number, target: number, factor: number): number {
  const t = Math.min(1, Math.max(0, factor));
  return current + (target - current) * t;
}
