import { expect, test } from '@playwright/test';

test('every navigation link can be scrolled into view on a phone', async ({ page }) => {
  await page.goto('/');
  const links = await page.getByRole('navigation', { name: 'Primary' }).getByRole('link').all();

  for (const link of links) {
    await link.scrollIntoViewIfNeeded();
    await expect(link).toBeInViewport({ ratio: 1 });
  }
});
