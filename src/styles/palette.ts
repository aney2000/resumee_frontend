// Canvas and WebGL cannot read CSS custom properties, so these mirror src/styles/tokens.css
// (palette.test.ts fails if they drift).
export const palette = {
  text: '#e7f0ea',
  muted: '#93a39a',
  accent: '#34d399',
  accent2: '#a3e635',
  badgeFace: '#0d1912',
  // 3D-only materials, no CSS counterpart.
  badgeBody: '#14261c',
  steel: '#c0c0c8',
} as const;
