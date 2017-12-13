const express = require('express');
const app = express();
const server = require('./server');
const config = require('./config');
app.use('/', server);
app.listen(config.port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`listening on http://localhost:${config.port}/`);
  }
});

