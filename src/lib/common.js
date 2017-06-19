// common functions used throughout the installer

const Promise = require('promise');
const spawn = require('child_process').spawn;
const fs = require('fs');
const path = require('path');

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

// returns path to program files for a 32-bit program
// e.g 'C:\\Program Files' on x86, 'C:\\Program Files (x86)' on x64
const getX86ProgramFilesDir = () => {
  // the program files (x86) environment var doesn't exist on 32-bit systems
  // if it doesn't exist, this must be a 32-bit system
  const programFilesX86 = process.env['programfiles(x86)'];
  return programFilesX86 || process.env.programfiles;
};

const version = () => {
  const info = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', 'package.json'), 'utf8'));
  return `${info.productName} v${info.version || '0.0.1'}`;
};

module.exports = {
  execAsyncCommand,
  getX86ProgramFilesDir,
  version
};
