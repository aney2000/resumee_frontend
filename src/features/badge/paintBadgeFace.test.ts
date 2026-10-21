import {
  type BadgePainterContext,
  paintBadgeBack,
  paintBadgeFront,
  wrapText,
} from '@/features/badge/paintBadgeFace';
import type { BadgeContent } from '@/features/badge/badgeContent';

const measure = (text: string) => text.length * 10;

describe('wrapText', () => {
  it('keeps short text on one line', () => {
    expect(wrapText(measure, 'hello world', 200)).toEqual(['hello world']);
  });

  it('breaks lines on word boundaries to fit the max width', () => {
    expect(wrapText(measure, 'one two three four', 90)).toEqual(['one two', 'three', 'four']);
  });

  it('keeps a word longer than the max width on its own line', () => {
    expect(wrapText(measure, 'a supercalifragilistic b', 50)).toEqual([
      'a',
      'supercalifragilistic',
      'b',
    ]);
  });

  it('returns no lines for blank text', () => {
    expect(wrapText(measure, '   ', 100)).toEqual([]);
  });
});

function recordingContext() {
  const texts: string[] = [];
  const images: unknown[] = [];
  const ctx: BadgePainterContext = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    fillRect: vi.fn(),
    fillText: vi.fn((text: string) => {
      texts.push(text);
    }),
    measureText: vi.fn((text: string) => ({ width: text.length * 10 }) as TextMetrics),
    beginPath: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    drawImage: vi.fn((image: unknown) => {
      images.push(image);
    }),
  };
  return { ctx, texts, images };
}

const content: BadgeContent = {
  front: {
    name: 'Ada Lovelace',
    title: 'Analytical Engine Programmer',
    organization: 'Babbage & Co',
    photoUrl: '/ada.png',
    badgeId: 'AE-1843',
  },
  back: {
    summary: 'word '.repeat(60).trim(),
    location: 'London, UK',
    contacts: [{ label: 'GitHub', url: 'https://github.com/ada' }],
  },
};

const size = { width: 512, height: 768 };

describe('paintBadgeFront', () => {
  it('draws the name, title, organization and badge id', () => {
    const { ctx, texts } = recordingContext();

    paintBadgeFront(ctx, content.front, undefined, size);

    expect(texts).toEqual(
      expect.arrayContaining(['Ada Lovelace', 'Analytical Engine Programmer', 'AE-1843']),
    );
    expect(texts).toContain('BABBAGE & CO');
  });

  it('draws the photo when provided, otherwise the initials', () => {
    const photo = {} as CanvasImageSource;
    const withPhoto = recordingContext();
    paintBadgeFront(withPhoto.ctx, content.front, photo, size);
    expect(withPhoto.images).toEqual([photo]);
    expect(withPhoto.texts).not.toContain('AL');

    const withoutPhoto = recordingContext();
    paintBadgeFront(withoutPhoto.ctx, content.front, undefined, size);
    expect(withoutPhoto.images).toEqual([]);
    expect(withoutPhoto.texts).toContain('AL');
  });
});

describe('paintBadgeBack', () => {
  it('wraps a long summary across several lines and draws location and contacts', () => {
    const { ctx, texts } = recordingContext();

    paintBadgeBack(ctx, content.back, size);

    const summaryLines = texts.filter((text) => /^word( word)*$/.test(text));
    expect(summaryLines.length).toBeGreaterThan(1);
    summaryLines.forEach((line) => expect(line.length * 10).toBeLessThanOrEqual(size.width));
    expect(texts).toContain('London, UK');
    expect(texts).toContain('GitHub');
  });
});
