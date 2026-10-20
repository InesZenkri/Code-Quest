# Contributing

Use Node.js 22.12 or newer. Run `npm ci`, then `npm run dev`.

## Add a challenge

Add an entry to `src/data/challenges.ts` with a unique ID, title, topic, difficulty, broken code, reference fix, hint, explanation and positive time limit in seconds.

Keep the snippet small and its intended behavior clear. Change one main bug at a time. For a logic bug, explain an input that produces the wrong result. Use a hint that points toward the problem instead of repeating the answer. Review the reference fix manually: the application compares text; it does not execute the snippet.

The UI currently uses one fixed sequence. If changing its length, update any end-to-end assertions that mention the total or final score.

## Before opening a PR

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

For logic changes, add a regression test in `tests/game.test.ts`. For UI behavior, add a browser test in `tests/e2e/game.spec.ts`. Check desktop and narrow mobile layouts, keyboard focus, long snippets and review feedback. Do not add `dist/`, `node_modules/`, credentials or local machine files to commits.

Describe the bug or behavior changed, how it was checked and any remaining limits. Keep documentation tied to the implementation; do not describe planned work as already available.
