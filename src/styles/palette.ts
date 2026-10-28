// Canvas and WebGL cannot read CSS custom properties, so these mirror src/styles/tokens.css
// (palette.test.ts fails if they drift).
export const palette = {
  text: '#e8eaf0',
  muted: '#9aa1b2',
  accent: '#8b5cf6',
  accent2: '#22d3ee',
  badgeFace: '#11141c',
  // 3D-only materials, no CSS counterpart.
  badgeBody: '#1e1b2e',
  steel: '#c0c0c8',
} as const;
