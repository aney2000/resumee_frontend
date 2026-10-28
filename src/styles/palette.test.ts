import tokens from '@/styles/tokens.css?raw';
import { palette } from '@/styles/palette';

function token(name: string): string | undefined {
  return new RegExp(`--${name}:\\s*([^;]+);`).exec(tokens)?.[1]?.trim();
}

describe('palette', () => {
  it.each([
    ['color-text', palette.text],
    ['color-text-muted', palette.muted],
    ['color-accent', palette.accent],
    ['color-accent-2', palette.accent2],
    ['color-badge', palette.badgeFace],
  ])('mirrors --%s from tokens.css', (name, value) => {
    expect(token(name)).toBe(value);
  });
});
