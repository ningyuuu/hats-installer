const common = require('./common.js');
const log = require('electron-log');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const npmPath = require('npm-path');
const Promise = require('promise');

const utils = {};
const checkStatus = setInterval(utils.checkPrereqInstalled, 1000);

const CMD_INSTALL_CHOCOLATEY = '@"%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" '
  + '-NoProfile -ExecutionPolicy Bypass -Command "iex '
  + '((New-Object System.Net.WebClient).DownloadString(\'https://chocolatey.org/install.ps1\'))" '
  + '&& SET "PATH=%PATH%;%ALLUSERSPROFILE%\\chocolatey\\bin"';
const CHOCO_PATH = 'C:\\ProgramData\\chocolatey\\choco.exe';
//   chocolatey path is being used instead of "choco"
// as path refreshing doesn't take effect till all shells are closed
const CMD_INSTALL_JDK8 = `"${CHOCO_PATH}" install jdk8 -lts --no-progress -y`;
const CMD_INSTALL_PYTHON2_X86 = `"${CHOCO_PATH}" install python2 -x86 --no-progress -y`;

utils.getPyLoc = function () {
  log.info('In getPyLoc');
  let pythonInstalledLoc = 'C:\\Python27\\';
  try {
    const pythonLoc = execSync('where python', { encoding: 'utf8' }).trim().toString();
    if (pythonLoc.includes('python.exe')) {
      pythonInstalledLoc = pythonLoc.replace('python.exe', '');
    } else {
      log.info(`unable to find python + ${pythonInstalledLoc}`);
    }
  } catch (err) {
    log.info(`finding python error: ${err}`);
  }
  log.info(`python location: ${pythonInstalledLoc}`);
  return pythonInstalledLoc.toString();
};

utils.getJavaLoc = function () {
  log.info('in getJavaLoc');
  let javaInstalledLoc = 'C:\\Program Files\\Java\\jre1.8.0_111\\bin\\'; // default location
  try {
    const javaLoc = execSync('where java', { encoding: 'utf8' }).toString();
    log.info(`refreshenv & where java string: ${javaLoc}`);
    if (javaLoc.includes('java.exe')) {
      if (javaLoc.includes('\r\n')) {
        log.info('Contains new line \\r\\n');
        javaInstalledLoc = javaLoc.replace(/java\.exe/g, '');
        javaInstalledLoc = javaInstalledLoc.split('\r\n').join(';');
        if (javaInstalledLoc.slice(-1) === ';') {
          log.info('Contains ;');
          javaInstalledLoc = javaInstalledLoc.slice(0, -1);
        }
      }
    } else {
      log.info(`unable to find java + ${javaInstalledLoc}`);
    }
  } catch (err) {
    log.info(`where java error: ${err}`);
  }
  log.info(`after modifying where java: ${javaInstalledLoc}`);
  return javaInstalledLoc.toString();
};

utils.setNpmPath = function (requireAddNewJava) {
  const PATH = npmPath.PATH;
  return new Promise((res) => {
    npmPath.set((err, $PATH) => {
      const pyPath = utils.getPyLoc();
      const javaPath = utils.getJavaLoc();
      if (!(process.env[PATH]).includes(pyPath)) {
        process.env[PATH] = `${$PATH};${pyPath};${pyPath}Scripts`;
      }
      const javaPathArr = javaPath.split(';');
      if (javaPathArr.length !== 0) {
        for (let i = 0; i < javaPathArr.length; i += 1) {
          if (!(process.env[PATH]).includes(javaPathArr[i])) {
            process.env[PATH] = `${$PATH};${javaPathArr[i]}`;
          }
        }
      }
      if (requireAddNewJava) {
        const newJavaPath = 'C:\\Program Files\\Java\\jre1.8.0_111\\bin';
        if (!(process.env[PATH]).includes(newJavaPath)) {
          process.env[PATH] = `${$PATH};${newJavaPath}`;
        }
      }
      log.info(`process.env[PATH]: ${process.env[PATH]}`);
      res();
    });
  });
};

utils.addAppiumRow = function (tableID) {
  log.info('In prerequisites.html addAppiumRow');

  const table = document.getElementById(tableID);
  const rowCount = table.rows.length;
  const row = table.insertRow(rowCount);
  const cell1 = row.insertCell(0);
  const moduleName = document.createTextNode('Appium > 1.5.0');

  cell1.className = 'text-left';
  cell1.appendChild(moduleName);

  const cell2 = row.insertCell(1);
  cell2.className = 'text-left';

  const oImg = document.createElement('img');
  oImg.setAttribute('src', './assets/imgs/checking.png');
  oImg.setAttribute('id', 'appium');
  oImg.setAttribute('class', 'checking');

  cell2.appendChild(oImg);

  log.info('Exiting prerequisites.html addAppiumRow');
};

utils.checkPrereqInstalled = function (installedChecks, elements) {
  log.info('In prerequisites.html checkPrereqInstalled');

  if (installedChecks.javaInstalled &&
    installedChecks.pythonInstalled &&
    installedChecks.pipInstalled) {
    if ($('#appium')) {
      if (installedChecks.appiumInstalled) {
        clearInterval(checkStatus);
        elements.next.disabled = false;
      }
    } else {
      clearInterval(checkStatus);
      elements.next.disabled = false;
    }
  } else {
    clearInterval(checkStatus);
    utils.installPrereq();
  }
  log.info('Exiting prerequisites.html dblCheckPrereqInstalled');
};

// disable arrow-body-style because fixing it  violates no-confusing-arrow
/* eslint-disable arrow-body-style */
// installs chocolatey, followed by the missing prerequisites
utils.installPrereqs = (isJavaRequired, isPythonOrPipRequired) =>
  common.execAsyncCommand(CMD_INSTALL_CHOCOLATEY)
    .then((stdout) => {
      return isJavaRequired ? common.execAsyncCommand(CMD_INSTALL_JDK8) : Promise.resolve();
    })
    .then((stdout) => {
      return isPythonOrPipRequired ? common.execAsyncCommand(CMD_INSTALL_PYTHON2_X86)
        : Promise.resolve();
    });
  //   utils.setNpmPath(true);
/* eslint-enable arrow-body-style */

utils.verifyJavaInstallation = function () {
  try {
    const getJavaVer = execSync('java -version:1.8 -version 2>&1', { encoding: 'utf8' });
    if (getJavaVer.toString().includes('1.8')) {
      log.info(`Java 1.8 detected: ${getJavaVer}`);
      return true;
    }
    log.info(`Java 1.8 not detected: ${getJavaVer}`);
    return false;
  } catch (err) {
    log.info(`java -version:1.8 -version 2>&1 err: ${err}, now trying java -version`);
    try {
      const getJavaVer = execSync('java -version 2>&1', { encoding: 'utf8' });
      if (getJavaVer.toString().includes('1.8')) {
        log.info(`Java 1.8 detected: ${getJavaVer}`);
        return true;
      }
      log.info(`Java 1.8 not detected: ${getJavaVer}`);
      return false;
    } catch (e) {
      log.info(`java -version failed: ${e}`);
      try {
        const javaLoc = execSync('where java', { encoding: 'utf8' }).toString();
        if (javaLoc.includes('javapath') || javaLoc.includes('jre1.8')) {
          log.info(`where java detects 1.8: ${javaLoc}`);
          return true;
        }
        log.info(`where java failed to detect 1.8: ${javaLoc}`);
        return false;
      } catch (error) {
        log.info(`where java err: ${error}`);
        return false;
      }
    }
  }
};

utils.verifyPythonInstallation = function () {
  log.info('Executing verify_python');
  try {
    const getPyVer = execSync('python --version 2>&1', { encoding: 'utf8' });
    if (getPyVer.toString().includes('2.7')) {
      log.info(`python27 detected: ${getPyVer}`);
      return true;
    }
    log.info(`python27 not detected: ${getPyVer}`);
    return false;
  } catch (err) {
    log.info(`python --version 2>&1 error: ${err}`);
    return false;
  }
};

utils.verifyPipInstallation = function () {
  log.info('Executing verify_pip()');
  try {
    const getPipVer = execSync('pip --version', { encoding: 'utf8' });
    if (getPipVer.toString().includes('2.7')) {
      log.info(`pip detected: ${getPipVer}`);
      return true;
    }
    log.info(`pip not detected: ${getPipVer}`);
    return false;
  } catch (err) {
    log.info(`verify pip - pip --version error: ${err}`);
    return false;
  }
};

utils.verifyAppium = function (elements, installedChecks) {
  log.info('In prerequisites.html verifyAppium');

  if (elements.appium !== null) {
    utils.set_loading_image(elements.appium);

    exec('appium --version', (error, stdout, stderr) => {
      log.info(`stdout: ${stdout}`);
      log.info(`stderr: ${stderr}`);

      if (error !== null) {
        log.info(`exec error: ${error}`);
        utils.set_not_found_image(elements.appium);
        installedChecks.appiumInstalled = false;
      }

      if (stderr.includes('1.5.') || stdout.includes('1.5.')) {
        utils.set_tick_image(elements.appium);
        installedChecks.appiumInstalled = true;
      } else {
        utils.set_not_found_image(elements.appium);
        installedChecks.appiumInstalled = false;
      }
    });
  }
  log.info('Exiting prerequisites.html verifyAppium');
};

module.exports = utils;
