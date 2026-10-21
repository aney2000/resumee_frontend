import { labelVisibility } from '@/features/cv3d/labelVisibility';

describe('labelVisibility', () => {
  it('shows the full label for the selected node', () => {
    expect(labelVisibility(3, 3)).toBe('full');
  });

  it('shows full labels for the immediate neighbours by default', () => {
    expect(labelVisibility(2, 3)).toBe('full');
    expect(labelVisibility(4, 3)).toBe('full');
  });

  it('reduces nodes further away to a dot', () => {
    expect(labelVisibility(1, 3)).toBe('dot');
    expect(labelVisibility(5, 3)).toBe('dot');
    expect(labelVisibility(0, 7)).toBe('dot');
  });

  it('honours a custom radius', () => {
    expect(labelVisibility(1, 3, 2)).toBe('full');
    expect(labelVisibility(2, 3, 0)).toBe('dot');
  });

  it('shows only dots when nothing is selected', () => {
    expect(labelVisibility(0, -1)).toBe('dot');
  });
});
