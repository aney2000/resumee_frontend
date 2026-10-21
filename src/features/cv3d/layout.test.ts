import type { TimelineEntry } from '@/domain/timeline';
import { cameraTargetFor, kindColors, layoutMilestones } from '@/features/cv3d/layout';

const entry = (
  id: string,
  start: string,
  kind: TimelineEntry['kind'] = 'project',
): TimelineEntry => ({
  id,
  kind,
  title: id,
  subtitle: '',
  start,
  description: '',
});

const newestFirst = [entry('c', '2022-01'), entry('b', '2020-06'), entry('a', '2018-03')];

describe('layoutMilestones', () => {
  it('orders milestones oldest first along the path', () => {
    const ids = layoutMilestones(newestFirst).map((m) => m.entry.id);
    expect(ids).toEqual(['a', 'b', 'c']);
  });

  it('is deterministic', () => {
    expect(layoutMilestones(newestFirst)).toEqual(layoutMilestones(newestFirst));
  });

  it('spaces milestones by the configured step along the path axis', () => {
    const depths = layoutMilestones(newestFirst, { spacing: 4 }).map((m) => m.position[2]);
    expect(depths).toEqual([0, -4, -8].map((z) => expect.closeTo(z)));
  });

  it('curves the path sideways within the configured radius', () => {
    const positions = layoutMilestones(newestFirst, { radius: 2 }).map((m) => m.position);
    expect(new Set(positions.map((p) => p[0].toFixed(3))).size).toBeGreaterThan(1);
    positions.forEach(([x, y]) => {
      expect(Math.abs(x)).toBeLessThanOrEqual(2 + 1e-9);
      expect(Math.abs(y)).toBeLessThanOrEqual(2 + 1e-9);
    });
  });

  it('returns an empty layout for no entries', () => {
    expect(layoutMilestones([])).toEqual([]);
  });
});

describe('cameraTargetFor', () => {
  it('places the camera in front of and above the milestone, looking at it', () => {
    const { position, lookAt } = cameraTargetFor([1, 2, -8]);
    expect(lookAt).toEqual([1, 2, -8]);
    expect(position[2]).toBeGreaterThan(-8);
    expect(position[1]).toBeGreaterThan(2);
  });
});

describe('kindColors', () => {
  it('defines a distinct colour for every kind', () => {
    const values = Object.values(kindColors);
    expect(values).toHaveLength(4);
    expect(new Set(values).size).toBe(4);
  });
});
