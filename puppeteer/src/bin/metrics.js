/**
 * Description. Pupperpeteer consume lots of resources at scale. Here are some
 * methods to help monitor performance
 * 
 *  status: request status, pending, success, failure
 *  endpoint: the url the req is accessing
 *  time_in: time when the request is recieved
 *  time_out: time when the request is completed
 *  duration: time diff between time_out and time_in
 *  tab_in: tabs open when req is received
 *  tab_out: tabs open when req in completed
 *  request_body: request json data
 * 
 * @author Jarry Ngandjui
 * @since 10.23.2020
 */

'use strict';

const statuses = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILURE: 'failure'
}

async function onReqEntry(req) {
  /**
   * Description. Attaches request metrics to req object. This is called 
   *              when app recieves a new request.
   * 
   * @param {Object} req Express req object
   * 
   */
  var pages = await req.browser.pages();
  var now = new Date();

  req.endpoint = req.url;
  req.status = statuses.PENDING;
  req.time_in = now
  req.tab_in = pages.length
}

async function onReqSuccess(req) {
  /**
   * Description. Sets metrics for successful request.
   *
   * @param {Object} req Express req object
   *
   */
  req.status = statuses.SUCCESS;
  await onReqEnd(req);
}

async function onReqFailure(req) {
  /**
   * Description. Sets metrics for failed request.
   *
   * @param {Object} req Express req object
   *
   */
  req.status = statuses.FAILURE;
  await onReqEnd(req);
}

async function onReqEnd(req) {
  /**
   * Description. Records the results metrics of each requests.
   *
   * @param {Object} req Express req object
   *
   */
  var pages = await req.browser.pages();
  var now = new Date();

  req.time_out = now;
  req.duration = millisecondsDiff(req.time_in, req.time_out);
  req.tab_out = pages.length;
}

function getMetrics(req) {
  /**
   * Description. Get req metrics.
   *
   * @param {Object} req Express req object
   *
   */
  var metrics = {
    status: req.status,
    endpoint: req.endpoint,
    time_in: req.time_in,
    time_out: req.time_out,
    duration: req.duration,
    tab_in: req.tab_in,
    tab_out: req.tab_out,
    request_body: req.body
  };

  return metrics;
}

const millisecondsDiff = (d1, d2) => {
  /**
   * Description. Returns the time difference between d1 and d2 in milliseconds.
   * 
   * @param {Date} d1 Earlier date
   * @param {Date} d2 Later date
   */
  return d2.getTime() - d1.getTime()
}

module.exports = {
  onReqEntry,
  onReqSuccess,
  onReqFailure,
  getMetrics
}