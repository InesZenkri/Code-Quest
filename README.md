# Debug Sprint

A small JavaScript debugging game. Read a broken snippet, type the fix, then check the explanation. Built with React, TypeScript and Vite.

The [hosted demo](https://debugit.netlify.app/) may run an older version until these changes are merged and deployed. Run the branch locally to try the version described below.

## Play

- **Sprint:** 12 rounds, a per-round clock and three lives. A timeout or skip costs one life. Wrong submissions can be retried before the deadline.
- **Practice:** the same challenges without a clock or lost lives. Skip to the reference fix when stuck.
- Each challenge has a topic, difficulty, hint and explanation. Topics include strings, functions, arrays, loops, operators and async code.
- Enter a multiline fix and press **Check fix** or **Ctrl/Cmd + Enter**. Review the explanation before moving on.
- A correct fix earns 100 points, plus seconds remaining in sprint mode. A hint reduces the potential reward for that round by 20 points, once. The last round counts too.
- The best completed sprint score is saved in this browser's local storage. There is no account, server-side history, leaderboard or achievement system. Disabled storage does not stop play.

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

The build includes a TypeScript check and writes to `dist/`. Deploy that folder to a static host with `npm ci && npm run build`; do not commit generated assets. No API keys or backend are needed.

## Checks

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Unit tests cover scoring, deadlines, hints, progression and challenge data. Chromium tests cover completing practice, sprint timeouts, retries, saved scores, keyboard submission and mobile layout with storage disabled. GitHub Actions runs these checks on pushes and pull requests.

## How it is built

```text
src/data/challenges.ts       Snippets, reference fixes, hints and explanations
src/lib/game.ts              Pure state transitions and answer matching
src/hooks/useGameLogic.ts    React state, deadline ticks and local storage
src/components/GameBoard.tsx Round input and review UI
src/App.tsx                 Mode selection and results
```

The game uses a deadline rather than counting interval callbacks. When a background tab resumes, the remaining time is recomputed from that deadline. A round locks after completion or timeout so later input cannot award points twice.

The UI uses plain CSS, labeled form controls, visible focus styles and a status message for feedback. Removed the starter's unused animation and icon dependencies rather than adding a larger UI framework.

## Deliberate limits

Answers are **not executed**. The matcher ignores outer whitespace and Windows line endings but otherwise requires the reference string, including internal spacing. Other valid JavaScript can be rejected. This keeps the app simple and avoids evaluating untrusted input, but it is not a semantic correctness checker or a full coding judge.

Challenges are a fixed sequence of short examples. They do not replace writing, testing or debugging complete programs. Scores are local, editable browser data, not verified skill measurements. Refreshing abandons the current run. There is no pause in sprint mode.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for challenge and test requirements. Useful next work: token-aware answer comparison, topic selection and a larger reviewed challenge set. These are ideas, not shipped features.

## License

[MIT](LICENSE).
