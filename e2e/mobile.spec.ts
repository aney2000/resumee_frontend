import { expect, test, type Page } from '@playwright/test';

test('every navigation link can be scrolled into view on a phone', async ({ page }) => {
  await page.goto('/');
  const links = await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').all();

  for (const link of links) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport({ ratio: 1 });
  }
});

/** Fraction of the badge stage, e.g. { x: 0.5, y: 0.45 } is where the card hangs at rest. */
interface StagePoint {
  readonly x: number;
  readonly y: number;
}

// Playwright's touchscreen only taps; CDP is needed for a real finger drag.
async function swipeUpOnBadgeStage(page: Page, from: StagePoint): Promise<number> {
  const stage = page.getByRole('img', { name: /interactive 3D badge/ });
  await stage.scrollIntoViewIfNeeded();
  await expect(stage.locator('canvas')).toBeVisible();
  // The badge swings in on load; let it settle where the card hangs at rest.
  await page.waitForTimeout(3000);
  const box = await stage.boundingBox();
  if (!box) throw new Error('badge stage has no layout box');

  const cdp = await page.context().newCDPSession(page);
  const x = box.x + box.width * from.x;
  const y = box.y + box.height * from.y;
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let step = 1; step <= 10; step += 1) {
    const touchPoints = [{ x, y: y - step * 12 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(300);
  return (await page.evaluate(() => window.scrollY)) - scrollBefore;
}

test('dragging the badge with a finger moves the badge, not the page', async ({ page }) => {
  await page.goto('/');

  expect(await swipeUpOnBadgeStage(page, { x: 0.5, y: 0.45 })).toBe(0);
});

test('swiping beside the badge still scrolls the page', async ({ page }) => {
  await page.goto('/');

  expect(await swipeUpOnBadgeStage(page, { x: 0.08, y: 0.9 })).toBeGreaterThan(0);
});
