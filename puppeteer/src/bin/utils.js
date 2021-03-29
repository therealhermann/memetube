/**
 * Description. Utility helper for youtube actions.
 *
 * @author Jarry Ngandjui
 * @since  09.19.2020
 */

'use strict';

const fs = require('fs');
const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');
const {
  accessKeyId,
  secretAccessKey,
  s3Bucket,
  s3Prefix,
  memeFilePath,
  youtubeExp,
  durationSelector,
  s3FramePrefix
} = require('./constants');

async function start() {
  /**
   * Description. Created a puppeteer browser.
   */
  return await puppeteer.launch();
}

async function newPage(browser) {
  /**
   * Description. Created a new page on the given browser.
   * 
   * @param {import('puppeteer').Browser} browser Browser return from puppeteer launch.
   */
  var page = await browser.newPage();

  await page.setViewport({
    width: 1440,
    height: 840,
  });

  return page;
};

function isYouTubeUrlValid(url) {
  /**
   * Description. Check if the url is a valid youtube video.
   *
   * @param {String} url YouTube url.
   */
  return youtubeExp.test(url);
}

async function isFrameOnS3(vTag, timestamp) {
  /**
   * Description. Checks if a clip already exist on s3.
   *
   * @param {String} vTag Youtube video v param.
   * @param {Number} timestamp Timestamp in seconds.
   */
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
  });

  var s3Path = memeFilename(vTag, timestamp, '/');
  var s3RequestParams = {
    Bucket: s3Bucket,
    Key: s3Prefix + s3Path,
  };

  var exists = await s3
    .headObject(s3RequestParams)
    .promise()
    .then(
      () => true,
      (err) => {
        if (err.code === 'NotFound') {
          // To-Do track number of found
          return false;
        }
        // To-Do include metrics on other error types
        return false;
      }
    );

  return exists;
}

async function localToS3(vTag, timestamp) {
  /**
   * Description. Upload a local file to s3 given a filename
   *
   * @param {String} vTag Youtube video v param.
   * @param {Number} timestamp Timestamp in seconds.
   */
  try {
    var localPath = memeFilePath + memeFilename(vTag, timestamp);
    var s3Path = memeFilename(vTag, timestamp, '/');
    var s3RequestParams = {
      Bucket: s3Bucket,
      Key: s3Prefix + s3Path,
      Body: await getFileData(localPath),
    };

    await s3UploadRequest(s3RequestParams);
    await deleteLocalFile(localPath);

    return s3Path;
  } catch (e) {
    throw e;
  }
};

async function s3UploadRequest(request) {
  /**
   * Description. Complete a S3 upload given request params.
   *
   * @param {Object} request S3 upload request parameters.
   * @param {String} request.Bucket S3 Bucket.
   * @param {String} request.key S3 Object filename.
   * @param {Buffer} request.Data S3 Object data.
   */
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
  });

  return new Promise((resolve, reject) => {
    s3.upload(request, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data);
    });
  });
};

async function getFileData(filename) {
  /**
   * Description. Get file data stream.
   * 
   * @param {String} filename File path.
   */
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });
};

async function deleteLocalFile(filename) {
  /**
   * Description. Delete local file.
   *
   * @param {String} filename File path.
   */
  return new Promise((resolve, reject) => {
    fs.unlink(filename, (error) => {
      if (error) {
        return reject(error);
      }

      return resolve("File deleted.");
    });
  });
}

async function clip(page, filename, prefix = './screenshots/') {
  /**
   * Description. Crops a full page puppeteer screenshot to the theater mode screen size.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} filename Filename to save the image crop.
   * @param {String} prefix Filename prefix
   */
  await page.screenshot({
    path: prefix + filename,
    clip: {
      x: 0,
      y: 55,
      width: 1440,
      height: 670,
    },
  });
};

async function screenshot(page, filename, prefix = './screenshots/') {
  /**
   * Description. Take screenshots of the current page.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} filename Filename to save the image crop.
   * @param {String} prefix Filename prefix
   */
  await page.screenshot({
    path: prefix + filename,
    fullPage: true,
  });
};

async function isFrameTimestampValid(page, timestamp) {
  /**
   * Summary. Checks that the give timestamp is less than the duration of the youtube video.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {Number} timestamp Timestamp in seconds.
   *
   */
  var duration = await getDuration(page);

  return timestamp < duration;
}

async function frameTimestamps(page, count = 1) {
  /**
   * Summary. Given the count of meme to be generated. Return array of random timestaps in (seconds)
   *          to take screenshots.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {Number} count Number of random timestamps to generate.
   *
   * Todo. Handle when the video is extremely short (ie. 3 seconds and count=5)
   */
  var duration = await getDuration(page);
  var interval = Math.floor(duration / count);
  var timestamps = [];

  while (timestamps.length != count) {
    var i = timestamps.length;
    var newTime = Math.min(
      getRandomInt(i * interval, (i + 1) * interval),
      duration
    );
    timestamps.push(newTime);
  }
  return timestamps;
}

async function getDuration(page) {
  /**
   * Description. Gets the duration of a youtube video in seconds.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   */
  var duration = await getInnerText(page, durationSelector);
  return hrMinSecFormatToSec(duration);
};


async function getInnerText(page, selector) {
  /**
   * Description. Get the innerText properter of an html element.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} selector HTML query selector.
   */
  await page.waitFor(selector);
  return await page.evaluate((el) => el.innerText, await page.$(selector));
};

async function existsElement(page, selector, timeout = 1000) {
  /**
   * Description. Checks if a selector exists on the current page.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} selector HTML query selector.
   * @param {Number} timeout Time in milliseconds till timeout.
   */
  try {
    // Scroll to load parts of the page
    await page.evaluate(async () => {
      window.scrollBy(0, window.innerHeight);
    });
    await page.evaluate(async () => {
      window.scrollBy(0, -window.innerHeight);
    });
    await page.waitForSelector(selector, {
      visible: true,
      timeout
    });
    return true;
  } catch (e) {
    return false;
  }
};

async function filter(arr, callback) {
  /**
   *  Description: Custom functon to filter arrays using async function.
   * 
   * @param {Array} arr Array of values.
   * @param {Callback} callback Asyn function used to filter arr.
   */
  const fail = Symbol();
  return (
    await Promise.all(
      arr.map(async (item) => ((await callback(item)) ? item : fail))
    )
  ).filter((i) => i !== fail);
}

function generateS3Paths(vTag, timestamps) {
  return timestamps.map(timestamp => `${s3FramePrefix}/${vTag}/${timestamp}.png`);
}

function memeFilename(vTag, timestamp, separator = '-') {
  /**
   * Description. Given a youtube url. Concat the urlID and timestamp to generate a uniqure filename.
   *               (ex. memeFilename('33xgszZJn_c', 1000) = 33xgszZJn_c-1000.png)
   *               (ex. memeFilename('33xgszZJn_c', 1000, '/') = 33xgszZJn_c/1000.png)
   *
   * @param {String} vTag Unique YouTube url "?v=" query value.
   * @param {Number} timestamp Timestamp in seconds.
   * @param {String} separator Filename seperator, defaults to '-' locally and '/' for s3.
   */
  var filename = vTag + separator + timestamp.toString() + '.png';
  return filename;
};

function hrMinSecFormatToSec(timestamp) {
  /**
   * Description. Given a youtube timestamp in hr:min:sec converts it to sec.
   * 
   * @param {String} timestamp Timestamp in hr:min:sec format.
   */
  var hrMinSec = timestamp.split(':');
  var seconds = 0;

  for (let i = 0; i < hrMinSec.length; i++) {
    seconds += parseInt(hrMinSec[i]) * Math.pow(60, hrMinSec.length - i - 1);
  }
  return seconds;
}

function halt(ms, message = '') {
  /**
   * Description. Perform a wait for a give number of milliseconds(ms). Optionally loging available.
   * 
   * @param {Number} ms Time in milliseconds till timeout.
   * @param {message} message Log message.
   */
  if (message) console.log(log(message));

  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

function log(message) {
  /**
   * Description. Create a timestamped log message.
   * 
   * @param {String} message Log message.
   */
  var date = new Date();
  var timestamp = `${date.getMonth()}-${date.getUTCDate()}-${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}       `;
  var logMessage = timestamp + message;
  return logMessage;
};

function getRandomInt(min = 0, max) {
  /**
   * Description. Get a random integer in the interval [min-max).
   * 
   * @param {Number} min Lower bound.
   * @param {Number} max Upper bound.
   */
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = {
  newPage,
  start,
  isYouTubeUrlValid,
  isFrameOnS3,
  localToS3,
  deleteLocalFile,
  clip,
  screenshot,
  filter,
  generateS3Paths,
  memeFilename,
  getInnerText,
  existsElement,
  isFrameTimestampValid,
  frameTimestamps,
  hrMinSecFormatToSec,
  halt,
  log,
  getRandomInt,
};