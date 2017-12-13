const path = require('path');
let config = {
  port: 'SET THIS VALUE',
  SSIDS: ['SET THESE VALUES'],
  dataDir: path.join(__dirname, 'SET THIS VALUE'),
  dataFname: 'SET THIS VALUE',
  dataPath: ''
};
config.dataPath = path.join(config.dataDir, config.dataFname);
module.exports = config;
