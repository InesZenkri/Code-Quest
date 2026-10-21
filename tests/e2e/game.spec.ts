import { test, expect } from '@playwright/test';
import { codeChallenges } from '../../src/data/challenges';
test('practice can be completed using keyboard submission', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start practice' }).click();
  for (const c of codeChallenges) {
    await page.getByLabel('Your fix').fill(c.solution);
    await page.getByLabel('Your fix').press('Control+Enter');
    await expect(page.getByRole('heading', { name: 'Bug fixed', exact: true })).toBeVisible();
    await page.getByRole('button', { name: c === codeChallenges.at(-1) ? 'See results' : 'Next challenge' }).click();
  }
  await expect(page.getByText('12 / 12 fixed')).toBeVisible();
  await expect(page.getByText('Sprint best on this browser')).toBeHidden();
});
test('sprint shows the reward breakdown after a correct fix', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start sprint' }).click();
  await page.getByLabel('Your fix').fill('wrong'); await page.getByRole('button', { name: 'Check fix' }).click();
  await expect(page.getByRole('status')).toContainText('Not the reference');
  await page.getByLabel('Your fix').fill(codeChallenges[0].solution);
  await page.getByRole('button', { name: 'Check fix' }).click();
  await expect(page.getByText(/\+\d+ points \(100 base \+ \d+ time - 10 wrong try\)/)).toBeVisible();
});
test('sprint timeout, retry, hint and game-over flow', async ({ page }) => {
  await page.clock.install(); await page.goto('/');
  await page.getByRole('button', { name: 'Start sprint' }).click();
  await page.getByLabel('Your fix').fill('wrong'); await page.getByRole('button', { name: 'Check fix' }).click();
  await expect(page.getByRole('status')).toContainText('Not the reference');
  await page.getByRole('button', { name: /Hint/ }).click();
  await expect(page.getByRole('button', { name: 'Hint shown' })).toBeDisabled();
  await page.clock.fastForward(46000);
  await expect(page.getByRole('status')).toContainText('Time is up');
  await page.getByRole('button', { name: 'Next challenge' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 1 ? 'See results' : 'Next challenge' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Out of lives. Keep practicing.' })).toBeVisible();
});
test('best score survives reload', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start sprint' }).click();
  await page.getByLabel('Your fix').fill(codeChallenges[0].solution); await page.getByRole('button', { name: 'Check fix' }).click();
  await page.getByRole('button', { name: 'Next challenge' }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 2 ? 'See results' : 'Next challenge' }).click();
  }
  await expect.poll(() => page.evaluate(() => localStorage.getItem('debug-game:sprint-best:v1'))).not.toBeNull();
  await page.reload(); await expect(page.getByText(/Sprint best on this browser: [1-9]/)).toBeVisible();
});
