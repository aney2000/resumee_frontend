import { expect, test } from '@playwright/test';

test('shows the hero and renders the 3D badge on a phone', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(
    page.getByRole('img', { name: /interactive 3D badge/ }).locator('canvas'),
  ).toBeVisible();
});
