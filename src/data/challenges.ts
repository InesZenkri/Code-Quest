export const codeChallenges = [
  {
    id: '1',
    code: 'console.log(Hello World);', // Missing quotes
    solution: 'console.log("Hello World");',
    hint: 'Strings need to be wrapped in quotes',
    timeLimit: 15
  },
  {
    id: '2',
    code: 'function sum(a, b) { retur a + b; }', // Missing 'n' in return
    solution: 'function sum(a, b) { return a + b; }',
    hint: 'Check the spelling of keywords',
    timeLimit: 20
  },
  {
    id: '3',
    code: 'const array = [1, 2, 3].map(x => x * 2;', // Missing closing parenthesis
    solution: 'const array = [1, 2, 3].map(x => x * 2);',
    hint: 'Make sure all parentheses are properly closed',
    timeLimit: 20
  },
  {
    id: '4',
    code: 'let counter == 0;', // Double equals instead of single
    solution: 'let counter = 0;',
    hint: 'Assignment uses single equals, comparison uses double equals',
    timeLimit: 15
  },
  {
    id: '5',
    code: 'if (x > 10 { console.log("Greater"); }', // Missing closing parenthesis
    solution: 'if (x > 10) { console.log("Greater"); }',
    hint: 'Check if all parentheses in the if statement are present',
    timeLimit: 20
  }
];