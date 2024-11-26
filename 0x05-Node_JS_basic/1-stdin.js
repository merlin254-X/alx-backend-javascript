// 1-stdin.js
const readline = require('readline');

// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Display the initial message
console.log('Welcome to Holberton School, what is your name?');

// Wait for user input
rl.on('line', (input) => {
  console.log(`Your name is: ${input}`);
  rl.close();
});

// Handle program exit
rl.on('close', () => {
  console.log('This important software is now closing');
});
