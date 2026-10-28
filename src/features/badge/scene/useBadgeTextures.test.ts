import { renderHook, waitFor } from '@testing-library/react';
import type { Texture } from 'three';
import type { BadgeContent } from '@/features/badge/badgeContent';
import type { BadgeCanvas, BadgeTextureDeps } from '@/features/badge/scene/useBadgeTextures';
import { useBadgeTextures } from '@/features/badge/scene/useBadgeTextures';

const content: BadgeContent = {
  front: {
    name: 'Ada Lovelace',
    title: 'Engineer',
    organization: 'Analytical',
    photoUrl: '/ada.png',
    badgeId: 'ID-1',
  },
  back: { summary: 'Hello', location: 'London', contacts: [] },
};

interface FakeTexture {
  canvas: BadgeCanvas;
  needsUpdate: boolean;
  dispose: ReturnType<typeof vi.fn>;
}

function fakeContext() {
  return {
    fillRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 10 })),
    beginPath: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    drawImage: vi.fn(),
  };
}

function setup(loadImage: BadgeTextureDeps['loadImage']) {
  const contexts: ReturnType<typeof fakeContext>[] = [];
  const textures: FakeTexture[] = [];
  const deps: BadgeTextureDeps = {
    createCanvas: ({ width, height }) => {
      const ctx = fakeContext();
      contexts.push(ctx);
      return { width, height, getContext: () => ctx as never };
    },
    loadImage,
    createTexture: (canvas) => {
      const texture: FakeTexture = { canvas, needsUpdate: false, dispose: vi.fn() };
      textures.push(texture);
      return texture as unknown as Texture;
    },
  };
  return { deps, contexts, textures };
}

describe('useBadgeTextures', () => {
  it('paints front and back canvases sharp enough for the enlarged badge', () => {
    const { deps, contexts, textures } = setup(() => new Promise(() => undefined));
    const { result } = renderHook(() => useBadgeTextures(content, deps));

    expect(result.current.front).toBe(textures[0]);
    expect(result.current.back).toBe(textures[1]);
    expect(textures[0]?.canvas).toMatchObject({ width: 1024, height: 1536 });
    const texts = (i: number) => contexts[i]?.fillText.mock.calls.map((c) => c[0]);
    expect(texts(0)).toContain('Ada Lovelace');
    expect(texts(0)).toContain('AL');
    expect(texts(1)).toContain('London');
  });

  it('repaints the front with the photo once it loads', async () => {
    const photo = {} as CanvasImageSource;
    const loadImage = vi.fn(() => Promise.resolve(photo));
    const { deps, contexts, textures } = setup(loadImage);
    renderHook(() => useBadgeTextures(content, deps));

    expect(loadImage).toHaveBeenCalledWith('/ada.png');
    await waitFor(() => expect(textures[0]?.needsUpdate).toBe(true));
    expect(contexts[0]?.drawImage).toHaveBeenCalledWith(
      photo,
      ...Array(4).fill(expect.any(Number)),
    );
  });

  it('keeps the initials when the photo fails to load', async () => {
    const loadImage = vi.fn(() => Promise.reject(new Error('404')));
    const { deps, contexts, textures } = setup(loadImage);
    renderHook(() => useBadgeTextures(content, deps));

    await waitFor(() => expect(loadImage).toHaveBeenCalled());
    await Promise.resolve();
    expect(contexts[0]?.drawImage).not.toHaveBeenCalled();
    expect(textures[0]?.needsUpdate).toBe(false);
  });

  it('disposes textures on unmount', () => {
    const { deps, textures } = setup(() => new Promise(() => undefined));
    const { unmount } = renderHook(() => useBadgeTextures(content, deps));
    unmount();
    expect(textures[0]?.dispose).toHaveBeenCalled();
    expect(textures[1]?.dispose).toHaveBeenCalled();
  });

  it('disposes old textures and creates new ones when content changes', () => {
    const { deps, textures } = setup(() => new Promise(() => undefined));
    const { result, rerender } = renderHook(({ c }) => useBadgeTextures(c, deps), {
      initialProps: { c: content },
    });
    const first = result.current.front;
    rerender({ c: { ...content, back: { ...content.back, location: 'Paris' } } });

    expect(result.current.front).not.toBe(first);
    expect(textures[0]?.dispose).toHaveBeenCalled();
    expect(textures[1]?.dispose).toHaveBeenCalled();
    expect(textures[2]?.dispose).not.toHaveBeenCalled();
  });

  it('ignores a photo that resolves after unmount', async () => {
    let resolve: (img: CanvasImageSource) => void = () => undefined;
    const { deps, contexts } = setup(() => new Promise((r) => (resolve = r)));
    const { unmount } = renderHook(() => useBadgeTextures(content, deps));
    unmount();
    resolve({} as CanvasImageSource);
    await Promise.resolve();
    expect(contexts[0]?.drawImage).not.toHaveBeenCalled();
  });
});
