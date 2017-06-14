// common functions used throughout the installer

const Promise = require('promise');
const spawn = require('child_process').spawn;
const fs = require('fs');

// executes a command asynchronously by spawning a new shell process
const execAsyncCommand = command => new Promise((resolve, reject) => {
  const process = spawn(command, [], { detached: false, shell: true });
  let stderr = '';
  let stdout = '';

  process.stderr.on('data', (chunk) => {
    stderr += chunk;
  });

  process.stdout.on('data', (chunk) => {
    stdout += chunk;
  });

  process.on('error', reject);

  process.on('exit', (code) => {
    if (code === 0) {
      resolve(stdout);
    } else {
      reject(`Process exited with code ${code}\n${stderr}`);
    }
  });
});

const version = () => {
  const info = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return `${info.productName} v${info.version || '0.0.1'}`;
};

module.exports = {
  execAsyncCommand,
  version
};
