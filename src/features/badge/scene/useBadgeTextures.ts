import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { BadgeContent } from '@/features/badge/badgeContent';
import type { BadgePainterContext, FaceSize } from '@/features/badge/paintBadgeFace';
import { paintBadgeBack, paintBadgeFront } from '@/features/badge/paintBadgeFace';

/** Badge face resolution; matches the 1:1.5 aspect ratio of the badge card. */
export const BADGE_FACE_SIZE: FaceSize = { width: 512, height: 768 };

/** The subset of a canvas element the hook needs. */
export interface BadgeCanvas {
  readonly width: number;
  readonly height: number;
  getContext(type: '2d'): BadgePainterContext | null;
}

export interface BadgeTextureDeps {
  createCanvas(size: FaceSize): BadgeCanvas;
  loadImage(url: string): Promise<CanvasImageSource>;
  createTexture(canvas: BadgeCanvas): Texture;
}

export interface BadgeTextures {
  readonly front: Texture;
  readonly back: Texture;
}

function createDomCanvas({ width, height }: FaceSize): BadgeCanvas {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function loadDomImage(url: string): Promise<CanvasImageSource> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load badge photo: ${url}`));
    image.src = url;
  });
}

function createCanvasTexture(canvas: BadgeCanvas): Texture {
  const texture = new CanvasTexture(canvas as HTMLCanvasElement);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export const defaultBadgeTextureDeps: BadgeTextureDeps = {
  createCanvas: createDomCanvas,
  loadImage: loadDomImage,
  createTexture: createCanvasTexture,
};

interface Face {
  readonly ctx: BadgePainterContext | null;
  readonly texture: Texture;
}

function createFace(deps: BadgeTextureDeps, paint: (ctx: BadgePainterContext) => void): Face {
  const canvas = deps.createCanvas(BADGE_FACE_SIZE);
  const ctx = canvas.getContext('2d');
  if (ctx) paint(ctx);
  return { ctx, texture: deps.createTexture(canvas) };
}

/**
 * Paints the badge faces onto canvases and exposes them as textures.
 * The front is painted with initials first and repainted once the photo loads.
 * Pass a stable `deps` object: a new one recreates the textures.
 */
export function useBadgeTextures(
  content: BadgeContent,
  deps: BadgeTextureDeps = defaultBadgeTextureDeps,
): BadgeTextures {
  const faces = useMemo(
    () => ({
      front: createFace(deps, (ctx) =>
        paintBadgeFront(ctx, content.front, undefined, BADGE_FACE_SIZE),
      ),
      back: createFace(deps, (ctx) => paintBadgeBack(ctx, content.back, BADGE_FACE_SIZE)),
    }),
    [content, deps],
  );

  useEffect(() => {
    let active = true;
    const { front } = faces;
    deps.loadImage(content.front.photoUrl).then(
      (photo) => {
        if (!active || !front.ctx) return;
        paintBadgeFront(front.ctx, content.front, photo, BADGE_FACE_SIZE);
        front.texture.needsUpdate = true;
      },
      () => undefined, // keep the initials painted on first render
    );
    return () => {
      active = false;
      faces.front.texture.dispose();
      faces.back.texture.dispose();
    };
  }, [faces, content, deps]);

  return { front: faces.front.texture, back: faces.back.texture };
}
