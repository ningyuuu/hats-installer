const log = require('electron-log');
const execSync = require('child_process').execSync;

document.addEventListener('DOMContentLoaded', () => {
  log.info(`process.resourcesPath: ${process.resourcesPath}`);

  const nextButton = document.getElementById('next');
  nextButton.onclick = () => {
    window.location.href = '../html/prerequisites.html';
  };

  (function callPwdOnExecSync() {
    // useless call to init child_process early to allow java elements to load
    log.info('pwd: ', execSync('pwd', { encoding: 'utf8' }));
  }());
});
