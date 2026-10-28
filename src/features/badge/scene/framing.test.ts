import { distanceToFill } from '@/features/badge/scene/framing';

describe('distanceToFill', () => {
  it('places the camera so the object fills the requested share of the view height', () => {
    // With a 90 degree field of view the visible height is twice the distance.
    expect(distanceToFill(2, 0.5, 90)).toBeCloseTo(2);
  });

  it('moves the camera closer when the object should fill more of the view', () => {
    expect(distanceToFill(2, 0.8, 25)).toBeLessThan(distanceToFill(2, 0.4, 25));
  });
});
