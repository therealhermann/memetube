/**
 * Description. Selector, s3, youtube constants and more.
 *
 * @author Jarry Ngandjui
 * @since  09.19.2020
 */

'use strict';

const memeFilePath = '/Users/jarry/Moi/Git/meme-tube/puppeteer/images/'

const accessKeyId = 'AKIAWB7SRTUNZQTZUM2F';
const secretAccessKey = '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';
const s3Bucket = 'dev-meme-tube';
const s3Prefix = 'frames/';
const s3FramePrefix = 'https://dev-meme-tube.s3.amazonaws.com/frames';

const youtubeExp = /^((https?:\/{2})?w{3}\.)?youtube\.com\/watch\?v=[\w-]+$/
const youtubeVExp = /^((https?:\/{2})?w{3}\.)?youtube\.com\/watch\?v=/

const titleSelector = 'h1.title';

// Thumbnail Selector
const thumbnailSelector = 'ytd-thumbnail #thumbnail.ytd-thumbnail'

// Advertisement Selectors
const adCheckSelector = 'div.ytp-ad-player-overlay';
const skipCheckSelector =
  'span.ytp-ad-skip-button-container[style*="display: none"]';
const skipAdButtonSelector = 'button.ytp-ad-skip-button';

// Comments Selectors
const voteSelector = '.ytd-comment-action-buttons-renderer#vote-count-middle';
const commentSelector = 'yt-formatted-string#content-text';
const commentLikeCount = '#vote-count-middle';

// Play back Selectors
const durationSelector = 'span.ytp-time-duration';
const playButtonSelector = 'button.ytp-play-button';
const videoSelector = 'video.video-stream';
const fullScreenButtonSelector = 'button.ytp-fullscreen-button';
const theaterScreenButtonSelector = 'button.ytp-size-button';
const theaterModeSelector = 'ytd-watch-flexy.ytd-page-manager[theater]';
const channelSelector = '.ytd-channel-name > a';

// Known youtube errors
const playabilityErrorSelector = 'div.yt-playability-error-supported-renderers';

module.exports = {
  accessKeyId,
  secretAccessKey,
  s3Bucket,
  s3Prefix,
  s3FramePrefix,
  memeFilePath,
  youtubeExp,
  youtubeVExp,
  titleSelector,
  adCheckSelector,
  skipAdButtonSelector,
  thumbnailSelector,
  voteSelector,
  commentSelector,
  durationSelector,
  playButtonSelector,
  theaterScreenButtonSelector,
  theaterModeSelector,
  channelSelector
};