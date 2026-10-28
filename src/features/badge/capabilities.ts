type CanvasFactory = () => Pick<HTMLCanvasElement, 'getContext'>;

// The only gate between 3D and the 2D fallbacks. Reduced motion is deliberately not one: Windows
// reports it whenever "Animation effects" is off, which would hide the 3D scenes on many machines.
export function supportsWebGL(
  createCanvas: CanvasFactory = () => document.createElement('canvas'),
): boolean {
  try {
    const canvas = createCanvas();
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
