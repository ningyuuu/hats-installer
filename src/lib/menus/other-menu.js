module.exports = function menu(mainWindow) {
  const otherMenu = [
    {
      label: 'hats',
      submenu: [
        {
          label: 'Contact',
          click() {
            require('electron').shell.openExternal('mailto:hats.supp@gmail.com');
          },
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            const electron = require('electron');
            const app = electron.app;
            app.quit();
          },
        },
      ],
    },
  ];
  return otherMenu;
};
