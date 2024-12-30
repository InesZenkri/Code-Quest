export const intermediateChallenges = [
  {
    id: 'int-1',
    code: `const promise = new Promise((resolve, reject) => {
  resolve("Success");
  reject("Error");
});`,
    solution: `const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve("Success");
  } else {
    reject("Error");
  }
});`,
    hint: 'Promises should either resolve OR reject, not both',
    timeLimit: 30
  },
  {
    id: 'int-2',
    code: `async function getData() {
  const response = await fetch('/api/data');
  return response;
}`,
    solution: `async function getData() {
  const response = await fetch('/api/data');
  return response.json();
}`,
    hint: 'Remember to parse the response data',
    timeLimit: 25
  },
  {
    id: 'int-3',
    code: `useEffect(() => {
  setInterval(() => {
    setCount(count + 1);
  }, 1000);
}, []);`,
    solution: `useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(timer);
}, []);`,
    hint: 'Consider cleanup and stale closures in effects',
    timeLimit: 40
  }
];