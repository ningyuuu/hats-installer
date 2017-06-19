const { app } = require('electron').remote;
const os = require('os');
const log = require('electron-log');
const childProcess = require('child_process');
const execSync = require('child_process').execSync;
const path = require('path');

const elements = {
  test: document.getElementById('test'),
  exit: document.getElementById('exit'),
  testInProgMsg: document.getElementById('testInProgMsg')
};

document.addEventListener('DOMContentLoaded', () => {
  elements.exit.disable = false;

  log.info(`OS tmpdir: ${os.tmpdir()}`);
  const currTestDir = path.join(__dirname, '..', 'testpage');
  const tempDir = os.tmpdir();
  const destTestDir = path.join(tempDir, 'testpage');
  log.info(`destTestDir: ${destTestDir}`);

  // copy testpage folder to windows temp folder + show message testing in progress
  elements.test.onclick = () => {
    execSync(`xcopy "${currTestDir}\\*" "${destTestDir}" /H /E /I /Y`, { encoding: 'utf8' });

    try {
      execSync('echo ;%PATH%;', { encoding: 'utf8' });
      const runTestCmd = childProcess.spawn('test.cmd', ['/s', '/c', '"C:\\Windows\\cmd.exe"'], {
        windowsVerbatimArguments: true, shell: true, cwd: destTestDir, encoding: 'ansi'
      });
      runTestCmd.stdout.on('data', (data) => {
        log.info(`stdout: ${data}`);
        // Here is where the output goes
      });
    } catch (err) {
      log.error(`runTestCmd err: ${err}`);
    }
  };

  elements.exit.onclick = () => {
    app.quit();
  };
});
