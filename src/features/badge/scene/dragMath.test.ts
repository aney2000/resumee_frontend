import {
  computeDragTarget,
  isClick,
  nextFlipRotation,
  smoothedRotation,
} from '@/features/badge/scene/dragMath';

describe('computeDragTarget', () => {
  it('subtracts the grab offset from the pointer position', () => {
    expect(computeDragTarget({ x: 1, y: 2, z: 3 }, { x: 0.5, y: -1, z: 0 })).toEqual({
      x: 0.5,
      y: 3,
      z: 3,
    });
  });

  it('returns the pointer itself for a zero offset', () => {
    expect(computeDragTarget({ x: -2, y: 0, z: 1 }, { x: 0, y: 0, z: 0 })).toEqual({
      x: -2,
      y: 0,
      z: 1,
    });
  });
});

describe('isClick', () => {
  const thresholds = { maxDistance: 5, maxDuration: 300 };

  it('accepts a short press without movement', () => {
    expect(isClick({ x: 10, y: 10 }, { x: 10, y: 10 }, 0, 120, thresholds)).toBe(true);
  });

  it('accepts movement exactly on the distance threshold', () => {
    expect(isClick({ x: 0, y: 0 }, { x: 3, y: 4 }, 0, 100, thresholds)).toBe(true);
  });

  it('rejects a press that moved further than the threshold (a drag)', () => {
    expect(isClick({ x: 0, y: 0 }, { x: 4, y: 4 }, 0, 100, thresholds)).toBe(false);
  });

  it('rejects a press held longer than the duration threshold', () => {
    expect(isClick({ x: 0, y: 0 }, { x: 0, y: 0 }, 0, 301, thresholds)).toBe(false);
  });

  it('rejects an up event that precedes the down event', () => {
    expect(isClick({ x: 0, y: 0 }, { x: 0, y: 0 }, 100, 50, thresholds)).toBe(false);
  });

  it('uses sensible defaults when no thresholds are given', () => {
    expect(isClick({ x: 0, y: 0 }, { x: 1, y: 1 }, 0, 100)).toBe(true);
    expect(isClick({ x: 0, y: 0 }, { x: 40, y: 0 }, 0, 100)).toBe(false);
  });
});

describe('nextFlipRotation', () => {
  it('turns the front to the back (0 to PI)', () => {
    expect(nextFlipRotation(0)).toBeCloseTo(Math.PI);
  });

  it('turns the back to the front (PI to 0)', () => {
    expect(nextFlipRotation(Math.PI)).toBeCloseTo(0);
  });

  it('snaps a mid-animation angle to the nearest face before flipping', () => {
    expect(nextFlipRotation(0.4)).toBeCloseTo(Math.PI);
    expect(nextFlipRotation(Math.PI - 0.4)).toBeCloseTo(0);
  });
});

describe('smoothedRotation', () => {
  it('moves a fraction of the way towards the target', () => {
    expect(smoothedRotation(0, Math.PI, 0.5)).toBeCloseTo(Math.PI / 2);
  });

  it('clamps the factor so it never overshoots', () => {
    expect(smoothedRotation(0, 1, 5)).toBe(1);
    expect(smoothedRotation(0, 1, -1)).toBe(0);
  });
});
