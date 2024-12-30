export const basicChallenges = [
  {
    id: 'basic-1',
    code: 'console.log(Hello World);',
    solution: 'console.log("Hello World");',
    hint: 'Strings need to be wrapped in quotes',
    timeLimit: 15
  },
  {
    id: 'basic-2',
    code: 'function sum(a, b) { retur a + b; }',
    solution: 'function sum(a, b) { return a + b; }',
    hint: 'Check the spelling of keywords',
    timeLimit: 20
  },
  {
    id: 'basic-3',
    code: 'const array = [1, 2, 3].map(x => x * 2;',
    solution: 'const array = [1, 2, 3].map(x => x * 2);',
    hint: 'Make sure all parentheses are properly closed',
    timeLimit: 20
  }
];