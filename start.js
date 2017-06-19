/**
 * Created by ningyu on 16/6/17.
 */
const wincmd = require('node-windows');
const path = require('path');

console.log(path.resolve(__dirname, 'node_modules', 'electron'));

wincmd.elevate('electron '+__dirname, {cwd: path.resolve(__dirname, 'node_modules', 'electron')});
