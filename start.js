/**
 * Created by ningyu on 16/6/17.
 */
const wincmd = require('node-windows');
const path = require('path');

const dirname = path.resolve(__dirname);
console.log(__dirname);

wincmd.elevate('electron ' + dirname, {cwd: path.resolve(__dirname, 'node_modules', '.bin')});
