import { supportsWebGL } from '@/features/badge/capabilities';

const canvasWith = (getContext: (id: string) => unknown) =>
  ({ getContext }) as unknown as HTMLCanvasElement;

describe('supportsWebGL', () => {
  it('is true when a webgl2 context is available', () => {
    expect(supportsWebGL(() => canvasWith((id) => (id === 'webgl2' ? {} : null)))).toBe(true);
  });

  it('falls back to a webgl context', () => {
    expect(supportsWebGL(() => canvasWith((id) => (id === 'webgl' ? {} : null)))).toBe(true);
  });

  it('is false when no context is available', () => {
    expect(supportsWebGL(() => canvasWith(() => null))).toBe(false);
  });

  it('is false when creating the context throws', () => {
    expect(
      supportsWebGL(() =>
        canvasWith(() => {
          throw new Error('blocked');
        }),
      ),
    ).toBe(false);
  });
});
