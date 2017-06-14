const { app } = require('electron').remote;
const { dialog } = require('electron').remote;
const log = require('electron-log');
const storage = require('electron-json-storage');
const utils = require('../lib/prereq-utils.js');

log.info('In prerequisites.html $(document).ready');

// assignment of elements and resources
const tickImg = 'fa fa-check fa-lg prereq-icon';
const loadingSpinner = 'fa fa-circle-o-notch fa-spin fa-lg fa-fw prereq-icon';
const notFoundImg = 'fa fa-times fa-lg prereq-icon';

const installedChecks = {
  javaInstalled: null,
  pythonInstalled: null,
  pipInstalled: null,
  appiumInstalled: null
};

const elements = {
  refresh: document.getElementById('refresh'),
  back: document.getElementById('back'),
  install: document.getElementById('install'),
  check: document.getElementById('check'),

  java: document.getElementById('java'),
  python: document.getElementById('python'),
  pip: document.getElementById('pip'),
  appium: document.getElementById('appium'),

  checkWeb: document.getElementById('webImg'),
  checkMobile: document.getElementById('mobileImg')
};

const modules = {
  mobile: false,
  web: false
};

// front end functions
const setLoadingImage = (element) => {
  element.setAttribute('aria-label', 'Loading');
  element.className = loadingSpinner;
};

const setTickImage = (element) => {
  element.setAttribute('aria-label', 'Dependency found');
  element.className = tickImg;
};

const setNotFoundImage = (element) => {
  element.setAttribute('aria-label', 'Dependency not found');
  element.src = notFoundImg;
};

const assignBackButtonFunction = function () {
  elements.back.onclick = function () {
    log.info('In prerequisites.html back.onclick');
    window.location.href = '../html/index.html';
    log.info('Exiting prerequisites.html back.onclick');
  };
};

const assignInstallButtonFunction = function () {
  elements.install.onclick = function () {
    window.location.href = '../html/installation.html';
  };
};

const enableInstallBtn = () => {
  elements.install.disabled = false;
};

const disableBackBtn = () => {
  console.log('disabling back');
  elements.back.disabled = true;
};

// sequences
const formatModuleElements = function (ele) {
  if (modules.web) {
    ele.checkWeb.className = tickImg;
    // ele.checkWeb.className += 'checking';
  } else {
    document.getElementById('web').style.color = '#c5c6cc';
  }

  if (modules.mobile) {
    ele.checkMobile.src = tickImg;
    ele.checkMobile.className += 'checking';
    utils.addAppiumRow('prereq_table');
  } else {
    document.getElementById('mobile').style.color = '#c5c6cc';
  }
};

const setDefaultModules = function (mod) {
  mod.mobile = false;
  mod.web = true;
};

const setPrereqStatusStorage = function () {
  return new Promise((res) => {
    console.log('In setPrereqStatusStorage()');
    storage.set('prereqMap', installedChecks, (err) => {
      log.info(`storage.set(prereqMap) err: ${err}`);
    });
    res();
  });
};

const verifyJava = function () {
  setLoadingImage(elements.java);
  if (utils.verifyJavaInstallation()) {
    setTickImage(elements.java);
    installedChecks.javaInstalled = true;
  } else {
    setNotFoundImage(elements.java);
    installedChecks.javaInstalled = false;
  }
};

const verifyPip = () => {
  setLoadingImage(elements.pip);
  if (utils.verifyPipInstallation()) {
    setTickImage(elements.pip);
    installedChecks.pipInstalled = true;
  } else {
    setNotFoundImage(elements.pip);
    installedChecks.pipInstalled = false;
  }
};

const verifyPython = () => {
  setLoadingImage(elements.python);
  if (utils.verifyPythonInstallation()) {
    setTickImage(elements.python);
    installedChecks.pythonInstalled = true;
  } else {
    setNotFoundImage(elements.python);
    installedChecks.pythonInstalled = false;
  }
};

const verifyAppium = () => {
  setTickImage(elements.appium);
  installedChecks.appiumInstalled = true;
};

const checkPrereqs = function (hasMobile) {
  log.info('Executing checkPrereqs()');
  return new Promise((res) => {
    utils.setNpmPath(true)
      .then(() => {
        verifyJava();
        verifyPip();
        verifyPython();
        if (hasMobile) {
          verifyAppium();
        }
        res();
      });
  });
};

const confirmPrereqsInstallationPrompt = () => {
  log.info('Prompting user to install!');

  const installPreReqNotice = {
    type: 'info',
    buttons: ['Yes', 'No'],
    title: 'Prerequisite Installation',
    message: 'Some prerequisites are missing. Install them now?'
  };

  return dialog.showMessageBox(installPreReqNotice);
};

const showPrereqInstallationSuccess = () => {
  const options = {
    type: 'info',
    buttons: ['OK'],
    title: 'Prerequisite Installation Successful',
    message: 'Prerequisites have been installed. hats installer will now close. '
      + 'When this happens, please close all instances of the command prompt and restart hats installer '
      + 'so as to allow detection of prerequisites.'
  };

  return dialog.showMessageBox(options);
};

const showPrereqInstallationError = (err) => {
  dialog.showErrorBox('Prerequisite Installation Error', `${err}`);
};

const activateNextOrPromptInstalls = () => {
  if (installedChecks.javaInstalled
    && installedChecks.pythonInstalled
    && installedChecks.pipInstalled) {
    enableInstallBtn();
  } else {
    const choice = confirmPrereqsInstallationPrompt();
    if (choice === 0) {
      disableBackBtn();
      const isJavaRequired = !installedChecks.javaInstalled;
      const isPythonOrPipRequired = !(installedChecks.pythonInstalled
          && installedChecks.pipInstalled);
      utils.installPrereqs(isJavaRequired, isPythonOrPipRequired)
      .then(() => {
        showPrereqInstallationSuccess();
        app.quit();
      })
      .catch(showPrereqInstallationError);
    }
  }
};

const initCheckPrereqsSequence = (hasMobile) => {
  checkPrereqs(hasMobile)
    .then(() => {
      setPrereqStatusStorage();
    })
    .then(() => {
      activateNextOrPromptInstalls();
    });
};

const grabPrereqs = () => {
  storage.get('prereqMap', (getErr, prereqMap) => {
    console.log('grabOrCheckPrereqs: ', prereqMap);
    for (const key in prereqMap) {
      if (Object.prototype.hasOwnProperty.call(prereqMap, key)) {
        installedChecks[key] = prereqMap[key];
      }
    }
    console.log('installedChecks.javaInstalled: ', installedChecks.javaInstalled);
    if (installedChecks.javaInstalled) setTickImage(elements.java);
    if (installedChecks.pythonInstalled) setTickImage(elements.python);
    if (installedChecks.pipInstalled) setTickImage(elements.pip);
    // if (installedChecks.appiumInstalled) set_tick_image(elements.appium);
    activateNextOrPromptInstalls();
  });
};

const grabOrCheckPrereqs = () => {
  storage.has('prereqMap', (err, hasKey) => {
    if (err) {
      log.error(`Error in storage.get prereqMap: ${err}`);
    } else if (hasKey) {
      log.info('Previously already checked prereqs.');
      grabPrereqs();
    } else {
      initCheckPrereqsSequence(modules.mobile);
    }
  });
};

// connecting front end and sequences
const attachRefreshButtonFunction = () => {
  elements.refresh.onclick = () => {
    log.info('Prerequisites.html: refresh.onclick');
    checkPrereqs(modules.mobile)
    .then(setPrereqStatusStorage)
    .then(activateNextOrPromptInstalls);
  };
};

// execute JS here
document.addEventListener('DOMContentLoaded', () => {
  setDefaultModules(modules);
  formatModuleElements(elements);

  grabOrCheckPrereqs();

  attachRefreshButtonFunction();
  assignBackButtonFunction();
  assignInstallButtonFunction();
});
