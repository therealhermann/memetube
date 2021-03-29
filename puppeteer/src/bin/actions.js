/**
 * Description. YouTube actions transcibed to functions
 *
 * @author Jarry Ngandjui
 * @since  09.19.2020
 */

'use strict';

const {
  isYouTubeUrlValid,
  isFrameOnS3,
  localToS3,
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
  getRandomInt
} = require('./utils');
const {
  memeFilePath,
  youtubeVExp,
  titleSelector,
  adCheckSelector,
  skipAdButtonSelector,
  voteSelector,
  commentSelector,
  playButtonSelector,
  theaterScreenButtonSelector,
  theaterModeSelector,
  channelSelector
} = require('./constants');


async function framesRandomComment(page, url, count = 1) {
  /**
   * Description. Returns the number of meme images requested and a random comment
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {Number} count Count of meme images to generate.
   * 
   * Todo. Consider creating new pages here for each meme count, and fetching them in parallel
   *       asyncronouslly.
   *
   *
   */
  var urlFrames = await frames(page, url, count = count)
  var urlTopComment = await randomComment(page, url)
  return { frames: urlFrames, comment: urlTopComment }
};

async function framesTopComment(page, url, count = 1) {
  /**
   * Description. Returns the number of meme images requested and the top comment
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {Number} count Count of meme images to generate.
   * 
   * Todo. Consider creating new pages here for each meme count, and fetching them in parallel
   *       asyncronouslly.
   *
   *
   */
  var urlFrames = await frames(page, url, count = count)
  var urlTopComment = await topComment(page, url)
  return { frames: urlFrames, comment: urlTopComment }
};

async function framesMany(page, urls, count = 1) {
  /**
   * Description. Generates frames for multiple YouTube Url
   * 
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {Arry} urls YouTube url.
   * @param {Number} count Count of meme images to generate.
   * 
   * Todo. Consider creating new pages here for each meme count, and fetching them in parallel
   *       asyncronouslly.
   *
   *
   */

  var vTagFrames = {};

  for (let i = 0; i < urls.length; i++) {
    var url = urls[i]
    var vTag = url.replace(youtubeVExp, '');
    vTagFrames = {
      ...vTagFrames,
      [vTag]: {
        ...(await frames(page, url, (count = count))),
      },
    };
  }

  return vTagFrames
};

async function frames(page, url, vTag, count = 1) {
  /**
   * Description. Generates the number of meme images matching the requested
   *              count.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {String} vTag Youtube video v param.
   * @param {Number} count Count of meme images to generate.
   *
   * Todo. Consider creating new pages here for each meme count, and fetching them in parallel
   *       asyncronouslly.
   *
   *
   */
  try {
    var contentInfo = await playYouTube(page, url);
    var timestamps = await frameTimestamps(page, count);
    var newTimestamps = await filter(timestamps, async (t) => !await isFrameOnS3(vTag, t));

    for (let i = 0; i < newTimestamps.length; i++) {
      await frame(page, url, vTag, newTimestamps[i]);
    }

    return { contentInfo, timestamps, frames: generateS3Paths(vTag, timestamps) };
  } catch (e) {
    throw e;
  }
};


async function frameAt(page, url, vTag, timestamp) {
  /**
   * Description. Create a frame at the given time stamp
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {String} vTag Youtube video v param.
   * @param {String} timestamp Timestamp in hr:min:sec format.
   *
   */
  try {
    var timestampInSec = hrMinSecFormatToSec(timestamp);
    var contentInfo = await playYouTube(page, url);

    if (!(await isFrameOnS3(vTag, timestampInSec))) {


      if (await isFrameTimestampValid(page, timestampInSec)) {
        await frame(page, url, vTag, timestampInSec);
      } else {
        throw Error('Invalid YouTube Timestamp');
      }
    }

    return { contentInfo, timestamps: [timestampInSec], frames: generateS3Paths(vTag, [timestampInSec]) };
  } catch (e) {
    throw e;
  }
}


async function frame(page, url, vTag, timestamp) {
  /**
   * Description. Generate a single meme image give a url and timestamp.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {String} vTag Youtube video v param.
   * @param {Number} timestamp Timestamp to screenshot in seconds.
   */
  var name = memeFilename(vTag, timestamp);
  var jumpTo = `${url}&t=${timestamp}`;

  await playYouTube(page, jumpTo, true);
  await theaterscreen(page);
  await clip(page, name, memeFilePath);
  await localToS3(vTag, timestamp);
}

async function topComment(page, url) {
  /**
   * Description. Gets the top comment for the given YouTube url.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   */
  var all = await allComments(page, url);

  if (all.count) {
    return { topComment: all.comments[0] };
  }

  return {
    comment: {},
  };
}

async function randomComment(page, url) {
  /**
   * Description. Gets the a random comment for the given YouTube url.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   */
  var all = await allComments(page, url);

  if (all.count) {
    var randomIndex = getRandomInt(0, all.count);
    return { randomComment: all.comments[randomIndex] };
  }

  return {
    comment: {}
  };
}

async function allComments(page, url) {
  /**
   * Description. Gets all comments and likes loaded by the given YouTube url.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   */
  var contentInfo = await playYouTube(page, url);
  try {
    if (isYouTubeUrlValid(url)) {
      var commentRating = [];

      if (await existsElement(page, commentSelector, 10000)) {
        //  Collect comments
        var comments = await page.evaluate(
          (selector) =>
          Array.from(document.querySelectorAll(selector)).map(
            (element) => element.innerText
          ),
          commentSelector
        );

        // Collect likes
        var votes = await page.evaluate(
          (selector) =>
          Array.from(document.querySelectorAll(selector)).map((element) => {
            let vote = element.innerText;
            let value = parseFloat(vote);
            if (vote.includes('K')) value *= 1000;
            return value;
          }),
          voteSelector
        );

        // Zip { comment: "", votes: int }
        // Sort by like (vote) count, hi -> lo
        var length = Math.min(comments.length, votes.length);

        for (let i = 0; i < length; i++) {
          commentRating.push({ text: comments[i], votes: votes[i] });
        }

        commentRating.sort((a, b) => {
          return b.votes - a.votes;
        });
      }

      return { contentInfo, comments: commentRating, count: commentRating.length };
    }
    throw Error('Invalid YouTube Url');
  } catch (e) {
    throw e;
  }
};

async function playYouTube(page, url, silent = false) {
  /**
   * Description. Loads the you video on the given page.
   * 
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {String} url YouTube url.
   * @param {bool} silent Turn off server logging.
   */
  var waitUntil = silent ?
    ['domcontentloaded'] :
    ['domcontentloaded', 'networkidle0'];

  await page.goto(url, { waitUntil });
  await pause(page);
  await page.mouse.move(0, 0);
  await halt(3000);

  var title = await getInnerText(page, titleSelector);
  var channel = await getInnerText(page, channelSelector);

  if (!silent) {
    await halt(500, 'Loading YouTube');
    await halt(500, `Playing ${title}`);
  }

  await advertisement(page);
  await screenshot(page, 'youtube.png');
  return { title, channel };
};


async function advertisement(page, silent = true) {
  /**
   * Description. Excute while youtube is showing ads.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   * @param {bool} silent Turn off server logging.
   */
  if (!silent) halt(500, 'Ads :(');

  while (await existsElement(page, adCheckSelector)) {
    await skipAds(page);
    await screenshot(page, 'ad.png');
  }
};

async function skipAds(page) {
  /**
   * Description. Click on the "SkipAd" button if present.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object
   */
  if (await existsElement(page, skipAdButtonSelector)) {
    await screenshot(page, 'skip-ad.png');
    await page.click(skipAdButtonSelector);
  }
}

async function theaterscreen(page) {
  /**
   * Description. Switch screen mode to theater screen.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object.
   */
  while (!(await existsElement(page, theaterModeSelector))) {
    halt(100, 'Waiting for theater mode');
    await page.click(theaterScreenButtonSelector);
  }
}

async function pause(page) {
  /**
   * Description. Click on the YouTube pause button.
   *
   * @param {import('puppeteer').Page} page Puppeteer page class object
   */
  await page.click(playButtonSelector);
};

module.exports = {
  framesRandomComment,
  framesTopComment,
  framesMany,
  frameAt,
  frames,
  topComment,
  randomComment,
  allComments,
  screenshot,
};