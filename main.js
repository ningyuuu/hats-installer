
// The main.js, execution starts from here
const path = require('path');
const electron = require('electron');
const log = require('electron-log');
const storage = require('electron-json-storage');

const { app, BrowserWindow } = electron;
const Menu = electron.Menu;
const ipcMain = electron.ipcMain;

// For the Toolbar menu
const darwinTemplate = require('./src/lib/menus/darwin-menu.js');
const otherTemplate = require('./src/lib/menus/other-menu.js');

const { version } = require('./src/lib/common');

let mainWindow = null;
const menu = null;
let thePrereqMap = null;
const winWidth = 800;
const winHeight = 630;

app.on('window-all-closed', () => {
  log.info('In main.js window-all-closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
  log.info('Exiting main.js window-all-closed');
});

app.on('ready', () => {
  log.info('In main.js appReady');

  // clearing storage at the start is needed
  // to clear state from previous runs
  // Putting this during shutdown won't work since this function executes asynchronously
  storage.clear((err) => {
    if (err) { console.log(err); }
  });

  mainWindow = new BrowserWindow({
    minWidth: winWidth,
    minHeight: winHeight,
    width: winWidth,
    height: winHeight,
    maxWidth: winWidth,
    maxHeight: winHeight,
    title: version()
  });
  mainWindow.loadURL(`file://${__dirname}/src/html/index.html`);
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  ipcMain.on('sendPrereqState', (event, data) => {
    log.info('In main.js sendPrereqState');
    log.info(`data['prereqMap'] = ${data.prereqMap}`);

    const prereqMap = data.prereqMap;
    const javaInst = prereqMap.javaInst;
    const pythonInst = prereqMap.pythonInst;
    const pipInst = prereqMap.pipInst;

    log.info(`javaInst = ${javaInst}`);
    log.info(`pythonInst = ${pythonInst}`);
    log.info(`pipInst = ${pipInst}`);
    thePrereqMap = prereqMap;

    log.info('Exiting main.js sendPrereqState');
  });

  // send thelicenseKeyMap to prerequisites page
  ipcMain.on('prereqStateMessage', (event, data) => {
    log.info('In main.js prereqStateMessage');
    log.info('In main.js prereqStateMessage (data): ', data);
    event.sender.send('handlePrereqState', thePrereqMap);
    log.info('Exiting main.js prereqStateMessage');
  });

  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    log.info('In main.js closed');
    mainWindow = null;
    log.info('Exiting main.js closed');
  });

  log.info('Exiting main.js appReady');
});
