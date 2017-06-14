const { app } = require('electron').remote;
const log = require('electron-log');

const utils = require('../lib/install-utils.js');

// assigning DOM elements
const elements = {
  backBtn: document.getElementById('back'),
  nextBtn: document.getElementById('next'),
  logTextArea: document.getElementById('log'),
  exitBtn: document.getElementById('exit'),
  errorInstalling: document.getElementById('errorInstalling'),
  successInstalling: document.getElementById('successInstalling'),
  installingInProgress: document.getElementById('installingInProgress')
};

// frontend functions
const assignBackButtonFunction = () => {
  elements.backBtn.onclick = () => {
    log.info('In installation.html back.onclick');
    window.location.href = '../html/prerequisites.html';
  };
};

const assignNextButtonFunction = () => {
  elements.nextBtn.onclick = () => {
    log.info('In installation.html next.onclick');
    window.location.href = '../html/summary.html';
  };
};

const assignExitButtonFunction = () => {
  elements.exitBtn.onclick = () => {
    app.quit();
  };
};

const attachFuncsToButtons = () => {
  assignBackButtonFunction();
  assignNextButtonFunction();
  assignExitButtonFunction();
};

const enableNextBtn = () => {
  elements.nextBtn.disabled = false;
};

const disableBackBtn = () => {
  console.log('disabling back');
  elements.backBtn.disabled = true;
};

const enableBackBtn = () => {
  console.log('enabling back');
  elements.backBtn.disabled = false;
};

// sequences
const updateUiOnInstallSuccess = () => {
  elements.exitBtn.style.display = 'none';
  elements.nextBtn.style.display = 'block';
  // enableBackBtn();
  enableNextBtn();
  elements.installingInProgress.style.display = 'none';
  elements.successInstalling.style.display = 'block';
};

const updateUiOnError = (err) => {
  elements.installingInProgress.style.display = 'none';
  elements.logTextArea.value = err;
  elements.logTextArea.style.display = 'block';
  elements.errorInstalling.style.display = 'block';
  elements.successInstalling.style.display = 'none';
  elements.exitBtn.style.display = 'block';
};

const installPipModules = () => utils.installPipModules();

const initInstallSequence = () => {
  installPipModules()
    .then(updateUiOnInstallSuccess)
    .catch(err => updateUiOnError(err));
};

// execute JS here
document.addEventListener('DOMContentLoaded', () => {
  log.info('Installation.html $(document).ready');
  attachFuncsToButtons();
  elements.logTextArea.value = ''; // Set error log to empty
  initInstallSequence();
});
