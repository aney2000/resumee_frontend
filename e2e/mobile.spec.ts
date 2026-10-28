import { expect, test, type Page } from '@playwright/test';

test('every navigation link can be scrolled into view on a phone', async ({ page }) => {
  await page.goto('/');
  const links = await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').all();

  for (const link of links) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport({ ratio: 1 });
  }
});

/** A point as a fraction of the badge stage; { x: 0.5, y: 0.45 } is where the card hangs at rest. */
interface StagePoint {
  readonly x: number;
  readonly y: number;
}

const badgeStage = (page: Page) => page.getByRole('img', { name: /interactive 3D badge/ });

async function settledBadgeStage(page: Page) {
  const stage = badgeStage(page);
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator('canvas')).toBeVisible();
  // The badge swings in on load; let it settle where the card hangs at rest.
  await page.waitForTimeout(3000);
  const box = await stage.boundingBox();
  if (!box) throw new Error('badge stage has no layout box');
  return (point: StagePoint) => ({
    x: box.x + box.width * point.x,
    y: box.y + box.height * point.y,
  });
}

// Playwright's touchscreen only taps; CDP is needed for a real finger drag.
async function putFingerOn(page: Page, start: { x: number; y: number }) {
  const cdp = await page.context().newCDPSession(page);
  let at = start;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [at] });
  return {
    async moveBy(dx: number, dy: number, steps = 10) {
      const from = at;
      for (let step = 1; step <= steps; step += 1) {
        at = { x: from.x + (dx * step) / steps, y: from.y + (dy * step) / steps };
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [at] });
      }
    },
    async lift() {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    },
  };
}

const scrollY = (page: Page) => page.evaluate(() => window.scrollY);

/** Horizontal centre of the card's white print (name, barcode), measured from rendered pixels. */
async function cardCentreX(page: Page): Promise<number> {
  const png = (await badgeStage(page).screenshot()).toString('base64');
  return page.evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('no 2d context');
    context.drawImage(image, 0, 0);
    // Skip the top band, where the white Cut/Reset labels sit.
    const top = Math.round(image.height * 0.2);
    const pixels = context.getImageData(0, top, image.width, image.height - top).data;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if ((pixels[i] ?? 0) > 200 && (pixels[i + 1] ?? 0) > 200 && (pixels[i + 2] ?? 0) > 200) {
        sum += (i / 4) % image.width;
        count += 1;
      }
    }
    return sum / count;
  }, png);
}

test('dragging the badge with a finger moves the badge, not the page', async ({ page }) => {
  await page.goto('/');
  const at = await settledBadgeStage(page);
  const before = await scrollY(page);

  const finger = await putFingerOn(page, at({ x: 0.5, y: 0.45 }));
  await finger.moveBy(0, -120);
  await finger.lift();

  expect(await scrollY(page)).toBe(before);
});

test('the badge follows a finger that holds it', async ({ page }) => {
  await page.goto('/');
  const at = await settledBadgeStage(page);
  const restX = await cardCentreX(page);

  const finger = await putFingerOn(page, at({ x: 0.5, y: 0.45 }));
  await finger.moveBy(-120, -60);
  await page.waitForTimeout(1500);
  const heldX = await cardCentreX(page);
  await finger.lift();

  expect(heldX).toBeLessThan(restX - 40);
});

test('swiping beside the badge still scrolls the page', async ({ page }) => {
  await page.goto('/');
  const at = await settledBadgeStage(page);
  const before = await scrollY(page);

  const finger = await putFingerOn(page, at({ x: 0.08, y: 0.9 }));
  await finger.moveBy(0, -120);
  await finger.lift();
  await page.waitForTimeout(300);

  expect(await scrollY(page)).toBeGreaterThan(before);
});
