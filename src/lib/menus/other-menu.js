const electron = require('electron');

module.exports = function menu() {
  const otherMenu = [
    {
      label: 'hats',
      submenu: [
        {
          label: 'Contact',
          click() {
            electron.shell.openExternal('mailto:hats.supp@gmail.com');
          }
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            const app = electron.app;
            app.quit();
          }
        }
      ]
    }
  ];
  return otherMenu;
};
