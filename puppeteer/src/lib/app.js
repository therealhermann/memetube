'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const metrics = require('../bin/metrics')
const { start } = require('../bin/utils');
const app = express();

app.use(bodyParser.json())

//  Open the browser
app.use('/', async (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  req.browser = await start();
  next()
});

// Stage metrics
app.use('/', async (req, _, next) => {
  console.log({ body: req.body })
  await metrics.onReqEntry(req);
  console.log(metrics.getMetrics(req));
  next();
})

// API routes
app.use('/clip/', require('./routes/clip'))
app.use('/comment/', require('./routes/comment'));
app.use('/meme/', require('./routes/meme'));

// Collect metrics
app.use('/', async (req, _, next) => {
  if (req.exit_code) {
    await metrics.onReqFailure(req);
  } else {
    await metrics.onReqSuccess(req)
  }
  console.log(req.response);
  console.log(metrics.getMetrics(req));
  req.response.data.metrics = metrics.getMetrics(req);
  next();
});

// Close the browser && respond
/**
 *  TO-DO: Distinguish between app error and request error codes
 */
app.use('/', async (req, res) => {
  req.browser.close();

  if (req.exit_code) {
    // if (req.error.message.includes('Invalid request params')) {
    //   res.statusMessage = req.error.message;
    // }
    res.status(400).send(req.response);
  } else {
    res.send(req.response);
  }
});

module.exports = app