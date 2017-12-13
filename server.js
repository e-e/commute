const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const app = express();
const jsonParser = bodyParser.json({ type: 'application/json' });

function logger(obj) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(obj);
  }
}

function verifyDataDir() {
  return new Promise((resolve, reject) => {
    const mask = '0777';
    fs.mkdir(config.dataDir, mask, function(err) {
      if (err) {
        if (err.code == 'EEXIST') resolve();
        else reject(err); // something else went wrong
      } else resolve(null); // successfully created folder
    });
  });
}
function verifyDataFile() {
  return new Promise((resolve, reject) => {
    fs.access(config.dataPath, function(err) {
      if (err && err.code === 'ENOENT') {
        fs.writeFile(config.dataPath, '[]', 'utf8', err => {
          resolve();
        });
      } else resolve();
    });
  });
}
function readData() {
  return new Promise((resolve, reject) => {
    fs.readFile(config.dataPath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
}
function saveData(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(config.dataPath, JSON.stringify(data), 'utf8', err => {
      if (err) return reject(err);
      resolve();
    });
  });
}
function isWorkDay(date) {
  return ![0, 6].includes(date.getDay());
}
function isCorrectSSID(ssid) {
  return config.SSIDS.includes(ssid);
}
async function save(date, ssid) {
  return new Promise(async (resolve, reject) => {
    if (!isWorkDay(date) || !isCorrectSSID(ssid)) resolve();
    let a = await verifyDataDir();
    let b = await verifyDataFile();
    let data = await readData();
    data.push({ date, ssid });
    let c = await saveData(data);
    resolve();
  });
}

app.get('/', async (req, res) => {
  let data = await readData();
  res.render('index', { data });
});
app.post('/', jsonParser, async (req, res) => {
  // logger(req);
  logger(req.body);
  if (!req.body.ssid) {
    return res.status(500).send({ error: 'Missing required fields' });
  }
  await save(new Date(), req.body.ssid);
  res.send('ok');
});

module.exports = app;
