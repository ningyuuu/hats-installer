/**
 * Created by ningyu on 30/5/17.
 */
const log = require('electron-log');
const path = require('path');

const Promise = require('promise');
const request = require('request');
const unzip = require('unzip');

const common = require('./common.js');

const WIN_INSTALL_LOCATION = 'C:\\Program Files (x86)\\hats';
const PIP_INSTALL_LIST_PATH = path.join(__dirname, '../lib/install-lists', 'pip-install-list.txt');
const CMD_PIP_INSTALL = `pip install -r "${PIP_INSTALL_LIST_PATH}"`;
const CMD_GET_HATS_DIR = 'echo %HATS%';
const CMD_SET_HATS_DIR = `setx HATS "${WIN_INSTALL_LOCATION}" /M`;
const CMD_SET_SYS_ENV_PATH = 'setx PATH "%path%;%HATS%" /M';

const drivers = [
  'https://chromedriver.storage.googleapis.com/2.29/chromedriver_win32.zip',
  'http://selenium-release.storage.googleapis.com/3.4/IEDriverServer_Win32_3.4.0.zip',
  'https://github.com/mozilla/geckodriver/releases/download/v0.16.0/geckodriver-v0.16.0-win32.zip'
];

const utils = {};

utils.unzipUrlAsStream = url => (
    request({
      followAllRedirects: true, 
      url: url
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

utils.installOnWindows = () => new Promise((resolve, reject) => {
  // install all prerequisites and requirements
  common.execAsyncCommand(CMD_PIP_INSTALL).then(() => {
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
