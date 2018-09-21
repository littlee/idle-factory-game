const prettier = require('prettier');
const address = require('address');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const configFile = path.resolve(__dirname, 'config.js');
const localIP = address.ip();

let config = require('./config');

config.BASE_URL = `http://${localIP}:8000/`;

let configContent = 'module.exports = ' + JSON.stringify(config, null, 2);
configContent = prettier.format(configContent, {
  singleQuote: true,
  parser: 'babylon'
});

// rewrite config file with localIP
fs.writeFileSync(configFile, configContent);

// start static server
shell.exec('anywhere -s -d __static');
