import { test, expect, type Page } from '@playwright/test';
import { codeChallenges } from '../../src/data/challenges';

// Decks are shuffled, so find the current challenge by its buggy code on screen.
async function solveCurrentRound(page: Page) {
  const buggy = (await page.locator('.board pre').first().innerText()).trim();
  const challenge = codeChallenges.find(c => c.code.trim() === buggy);
  if (!challenge) throw new Error(`No challenge matches on-screen code: ${buggy.slice(0, 60)}`);
  await page.getByLabel('Your fix').fill(challenge.solution);
  await page.getByLabel('Your fix').press('Control+Enter');
}

test('practice rounds can be solved by keyboard and the game can be left', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start practice' }).click();
  for (let i = 0; i < 3; i++) {
    await solveCurrentRound(page);
    await expect(page.getByRole('heading', { name: 'Bug fixed', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Next challenge' }).click();
  }
  await page.getByRole('button', { name: 'Leave round / choose mode' }).click();
  await expect(page.getByRole('button', { name: 'Start daily' })).toBeVisible();
});

test('sprint shows the reward breakdown after a correct fix', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start sprint' }).click();
  await page.getByLabel('Your fix').fill('wrong'); await page.getByRole('button', { name: 'Check fix' }).click();
  await expect(page.getByRole('status')).toContainText('Not the reference');
  await solveCurrentRound(page);
  await expect(page.getByText(/\+\d+ points \(100 base \+ \d+ time - 10 wrong try\)/)).toBeVisible();
});

test('sprint timeout, retry, hint and game-over flow', async ({ page }) => {
  await page.clock.install(); await page.goto('/');
  await page.getByRole('button', { name: 'Start sprint' }).click();
  await page.getByLabel('Your fix').fill('wrong'); await page.getByRole('button', { name: 'Check fix' }).click();
  await expect(page.getByRole('status')).toContainText('Not the reference');
  await page.getByRole('button', { name: /Hint/ }).click();
  await expect(page.getByRole('button', { name: 'Hint shown' })).toBeDisabled();
  await page.clock.fastForward(130000);
  await expect(page.getByRole('status')).toContainText('Time is up');
  await page.getByRole('button', { name: 'Next challenge' }).click();
  for (let i = 0; i < 2; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 1 ? 'See results' : 'Next challenge' }).click();
  }
  await expect(page.getByRole('heading', { name: 'Out of lives. Keep practicing.' })).toBeVisible();
  await expect(page.locator('.stat span', { hasText: 'accuracy' })).toBeVisible();
  await expect(page.locator('.recap li')).toHaveCount(3);
});

test('daily sprint saves its own best score', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start daily' }).click();
  await solveCurrentRound(page);
  await expect(page.getByRole('heading', { name: 'Bug fixed', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next challenge' }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 2 ? 'See results' : 'Next challenge' }).click();
  }
  await expect(page.getByText('Daily sprint complete')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('debug-game:daily-best:v1'))).not.toBeNull();
  await page.reload(); await expect(page.getByText(/Best on this browser: \d+ sprint · [1-9]\d* daily/)).toBeVisible();
});

test('best score survives reload', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Start sprint' }).click();
  await solveCurrentRound(page);
  await page.getByRole('button', { name: 'Next challenge' }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 2 ? 'See results' : 'Next challenge' }).click();
  }
  await expect.poll(() => page.evaluate(() => localStorage.getItem('debug-game:sprint-best:v1'))).not.toBeNull();
  await page.reload(); await expect(page.getByText(/Best on this browser: [1-9]\d* sprint/)).toBeVisible();
});

test('share button copies a result summary', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/'); await page.getByRole('button', { name: 'Start sprint' }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: /Skip/ }).click();
    await page.getByRole('button', { name: i === 2 ? 'See results' : 'Next challenge' }).click();
  }
  await page.getByRole('button', { name: 'Copy result' }).click();
  await expect(page.getByRole('button', { name: 'Copied!' })).toBeVisible();
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain('Debug Sprint');
  expect(clip).toContain('https://debugit.netlify.app');
});
