/**
 * Created by ningyu on 30/5/17.
 */
const assert = require('assert');
const childProcess = require('child_process');
const log = require('electron-log');
const os = require('os');
const path = require('path');
const Promise = require('promise');
const request = require('request');
const unzip = require('unzip');

const common = require('./common.js');

const WIN_INSTALL_LOCATION = `${common.getX86ProgramFilesDir()}\\hats`;
const PIP_INSTALL_LIST_PATH = path.join(__dirname, '../lib/install-lists', 'pip-install-list.txt');
const CMD_PIP_INSTALL = `pip install -r "${PIP_INSTALL_LIST_PATH}"`;
const CMD_GET_HATS_DIR = 'echo %HATS%';
const CMD_SET_HATS_DIR = `setx HATS "${WIN_INSTALL_LOCATION}" /M`;
const CMD_SET_SYS_ENV_PATH = 'setx PATH "%path%;%HATS%" /M';
const WIN7_X64_REG_PATCH = 'REG ADD "HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Microsoft\\Internet Explorer\\MAIN'
  + '\\FeatureControl\\FEATURE_BFCACHE" /v iexplore.exe /t REG_DWORD /d 0 /f';
const WIN7_X86_REG_PATCH = 'REG ADD "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Internet Explorer\\MAIN'
  + '\\FeatureControl\\FEATURE_BFCACHE" /v iexplore.exe /t REG_DWORD /d 0 /f';

const drivers = [
  'https://chromedriver.storage.googleapis.com/2.29/chromedriver_win32.zip',
  'http://selenium-release.storage.googleapis.com/3.4/IEDriverServer_Win32_3.4.0.zip',
  'https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-win32.zip'
];

const utils = {};

utils.unzipUrlAsStream = url => (
    request({
      followAllRedirects: true,
      url
    })
      .pipe(unzip.Extract({
        path: WIN_INSTALL_LOCATION
      }))
  );

utils.getHatsDirectory = () => common.execAsyncCommand(CMD_GET_HATS_DIR);

utils.setupHatsDirectory = (hatsDir) => {
  const saveDirExist = hatsDir.includes(WIN_INSTALL_LOCATION);
  if (!saveDirExist) {
    log.info('Path does not exist: attempting to add path');
    common.execAsyncCommand(CMD_SET_HATS_DIR).then(() => {
      common.execAsyncCommand(CMD_SET_SYS_ENV_PATH);
    });
  } else {
    log.info('addPath message: path exist');
  }
};

utils.extractBrowserDrivers = () => {
  try {
    // extract chrome and IE driver and copy to hats folder
    drivers.map(utils.unzipUrlAsStream);

    // check sys env var path for existing path and add if not exist
    utils.getHatsDirectory().then((hatsDir) => {
      utils.setupHatsDirectory(hatsDir);
    });
  } catch (err) {
    log.error('Extract browser drivers error: ', err);
  }
};

// returns 32 or 64, depending on the OS's architecture
const getBitness = () => {
  const output = childProcess.execSync('wmic OS get OSArchitecture | findstr bit').toString();
  const matches = /(\d+)-bit/.exec(output);
  assert.ok(matches.length >= 2, 'Could not determine OS architecture, wmic unexpected output');
  const bitness = parseInt(matches[1], 10);
  assert.ok(bitness === 32 || bitness === 64, 'Architecture is neither 32 or 64 bit');
  return bitness;
};

// Applies a registry patch so that tests run on Win7/8/8.1 IE
const applyIePatchIfRequired = () => new Promise((resolve, reject) => {
  const osVer = os.release();
  const isPatchRequired = os.platform() === 'win32' && /^6\.(1|2)/.test(osVer);
  if (isPatchRequired) {
    let cmd = '';
    switch (getBitness()) {
      case 32:
        cmd = WIN7_X86_REG_PATCH;
        break;
      case 64:
        cmd = WIN7_X64_REG_PATCH;
        break;
      default:
        reject('Unrecognized architecture');
    }

    common.execAsyncCommand(cmd)
    .catch((err) => {
      reject(`Could not apply Win7 IE patch: ${err}`);
    });
  } else {
    resolve();
  }
});

utils.installOnWindows = () => new Promise((resolve, reject) => {
  // install all prerequisites and requirements
  common.execAsyncCommand(CMD_PIP_INSTALL)
  .then(applyIePatchIfRequired)
  .then(() => {
    utils.extractBrowserDrivers();
    resolve();
  }).catch((err) => {
    log.info(err);
    reject(err);
  });
});

utils.installPipModules = () => {
  log.info('In installation.html installPipModules');
  if (process.platform === 'linux' || process.platform === 'darwin') {
    log.info(`OS is Linux/Mac: ${process.platform}`);
    // return utils.installOnLinuxOrMac();
    return utils.installOnWindows();
  }
  log.info(`OS is not Linux/Mac: ${process.platform}`);
  return utils.installOnWindows();
};

module.exports = utils;
