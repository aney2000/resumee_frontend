import type { BadgeBack, BadgeFront } from '@/features/badge/badgeContent';
import { initials } from '@/features/badge/badgeContent';

/** The subset of the 2D canvas API the painters rely on. */
export type BadgePainterContext = Pick<
  CanvasRenderingContext2D,
  | 'fillStyle'
  | 'strokeStyle'
  | 'lineWidth'
  | 'font'
  | 'textAlign'
  | 'textBaseline'
  | 'fillRect'
  | 'fillText'
  | 'measureText'
  | 'beginPath'
  | 'arc'
  | 'closePath'
  | 'fill'
  | 'stroke'
  | 'clip'
  | 'save'
  | 'restore'
> & {
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
};

export interface FaceSize {
  readonly width: number;
  readonly height: number;
}

// Mirrors src/styles/tokens.css: canvas cannot read CSS custom properties.
const palette = {
  background: '#11141c',
  text: '#e8eaf0',
  muted: '#9aa1b2',
  accent: '#8b5cf6',
  accent2: '#22d3ee',
} as const;

const FONT_FAMILY = "Inter, system-ui, 'Segoe UI', Roboto, sans-serif";
const font = (weight: number, px: number) => `${weight} ${Math.round(px)}px ${FONT_FAMILY}`;

/** Greedy word wrap; a single word wider than `maxWidth` gets its own line. */
export function wrapText(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && measure(candidate) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function paintBackground(ctx: BadgePainterContext, { width, height }: FaceSize): void {
  ctx.fillStyle = palette.background;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = palette.accent;
  ctx.fillRect(0, 0, width, height * 0.02);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

function paintPhoto(
  ctx: BadgePainterContext,
  name: string,
  photo: CanvasImageSource | undefined,
  cx: number,
  cy: number,
  radius: number,
): void {
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  if (photo) {
    ctx.clip();
    ctx.drawImage(photo, cx - radius, cy - radius, radius * 2, radius * 2);
  } else {
    ctx.fillStyle = palette.accent;
    ctx.fill();
    ctx.fillStyle = palette.text;
    ctx.font = font(700, radius * 0.8);
    ctx.fillText(initials(name), cx, cy);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = radius * 0.06;
  ctx.stroke();
}

function paintBarcode(ctx: BadgePainterContext, x: number, y: number, w: number, h: number): void {
  const pattern = [2, 1, 3, 1, 1, 2, 1, 3];
  const unit = w / 120;
  ctx.fillStyle = palette.text;
  for (let offset = 0, i = 0; offset < w; i += 1) {
    const bar = (pattern[i % pattern.length] ?? 1) * unit;
    if (i % 2 === 0) ctx.fillRect(x + offset, y, Math.min(bar, w - offset), h);
    offset += bar + unit;
  }
}

export function paintBadgeFront(
  ctx: BadgePainterContext,
  front: BadgeFront,
  photo: CanvasImageSource | undefined,
  size: FaceSize,
): void {
  const { width: w, height: h } = size;
  const cx = w / 2;
  paintBackground(ctx, size);

  ctx.fillStyle = palette.accent2;
  ctx.font = font(600, w * 0.045);
  ctx.fillText(front.organization.toUpperCase(), cx, h * 0.1);

  paintPhoto(ctx, front.name, photo, cx, h * 0.32, w * 0.22);

  ctx.fillStyle = palette.text;
  ctx.font = font(700, w * 0.075);
  ctx.fillText(front.name, cx, h * 0.56);

  ctx.fillStyle = palette.muted;
  ctx.font = font(400, w * 0.045);
  wrapText((t) => ctx.measureText(t).width, front.title, w * 0.85).forEach((line, i) =>
    ctx.fillText(line, cx, h * 0.63 + i * w * 0.06),
  );

  paintBarcode(ctx, w * 0.1, h * 0.78, w * 0.8, h * 0.08);

  ctx.fillStyle = palette.text;
  ctx.font = font(500, w * 0.045);
  ctx.fillText(front.badgeId, cx, h * 0.92);
}

export function paintBadgeBack(ctx: BadgePainterContext, back: BadgeBack, size: FaceSize): void {
  const { width: w, height: h } = size;
  const cx = w / 2;
  const lineHeight = w * 0.06;
  paintBackground(ctx, size);

  ctx.fillStyle = palette.text;
  ctx.font = font(400, w * 0.042);
  const lines = wrapText((t) => ctx.measureText(t).width, back.summary, w * 0.84);
  lines.forEach((line, i) => ctx.fillText(line, cx, h * 0.12 + i * lineHeight));

  let y = h * 0.12 + lines.length * lineHeight + lineHeight;
  ctx.fillStyle = palette.muted;
  ctx.fillText(back.location, cx, y);

  ctx.fillStyle = palette.accent2;
  ctx.font = font(600, w * 0.042);
  for (const contact of back.contacts) {
    y += lineHeight * 1.2;
    ctx.fillText(contact.label, cx, y);
  }
}
