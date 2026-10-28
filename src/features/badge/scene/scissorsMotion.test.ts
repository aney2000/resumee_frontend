import { scissorsPose, SNIP_AT } from '@/features/badge/scene/scissorsMotion';

const distance = ({ x, y, z }: { x: number; y: number; z: number }) => Math.hypot(x, y, z);

describe('scissorsPose', () => {
  it('starts away from the lanyard with the blades wide open', () => {
    const start = scissorsPose(0);

    expect(distance(start.offset)).toBeGreaterThan(2);
    expect(start.opening).toBeGreaterThan(0.3);
  });

  it('reaches the lanyard with open blades before the snip', () => {
    const arrived = scissorsPose(SNIP_AT * 0.6);

    expect(distance(arrived.offset)).toBeCloseTo(0);
    expect(arrived.opening).toBeCloseTo(scissorsPose(0).opening);
  });

  it('closes the blades on the lanyard at the snip', () => {
    const snip = scissorsPose(SNIP_AT);

    expect(distance(snip.offset)).toBeCloseTo(0);
    expect(snip.opening).toBeCloseTo(0);
  });

  it('leaves the scene with closed blades after the snip', () => {
    const end = scissorsPose(1);

    expect(distance(end.offset)).toBeGreaterThan(2);
    expect(end.opening).toBeCloseTo(0);
  });

  it('clamps progress outside the animation', () => {
    expect(scissorsPose(-1)).toEqual(scissorsPose(0));
    expect(scissorsPose(2)).toEqual(scissorsPose(1));
  });
});
