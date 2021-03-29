'use strict';

const { youtubeVExp, youtubeExp } = require('../../bin/constants');
const { newPage, isYouTubeUrlValid } = require('../../bin/utils');
const { frames, frameAt, framesMany } = require('../../bin/actions');

module.exports = {
  frame: async (req, _, next) => {
    /**
     * Description. Clips n(count) of frames from a valid youtube url.
     */
    try {
      var url = req.body.url;
      var count = req.body.count;
      var vTag = url.replace(youtubeVExp, '');
      var page = await newPage(req.browser);

      if (!isYouTubeUrlValid(url)) {
        throw Error('Invalid youtube url');
      } else if (!count) {
        throw Error('Missing count param');
      } else {
        req.response = {
          success: true,
          data: {
            vTag,
            ...(await frames(page, url, vTag, count)),
          },
        };

        req.exit_code = 0;
      }
    } catch (e) {
      console.log({ msg: 'Clip error happended' });
      console.log({ e });
      req.exit_code = 1;
      req.response = {
        success: false,
        data: {
          error: e.name,
          message: e.message,
        },
      };
    }
    next();
  },

  frameAt: async (req, _, next) => {
    /**
     * Description. Clips n(count) of frames from a valid youtube url.
     */
    try {
      var url = req.body.url;
      var vTag = url.replace(youtubeVExp, '');
      var timestamp = req.body.timestamp;
      var page = await newPage(req.browser);

      if (!isYouTubeUrlValid(url) || !timestamp) {
        throw Error('Invalid request params');
      } else {
        req.response = {
          success: true,
          data: {
            vTag,
            ...(await frameAt(page, url, vTag, timestamp)),
          },
        };

        req.exit_code = 0;
      }
    } catch (e) {
      console.log({ msg: 'Clip error happended' });
      console.log({ e });
      req.exit_code = 1;
      req.response = {
        success: false,
        data: {
          error: e.name,
          message: e.message,
        },
      };
    }
    next();
  },

  frames: async (req, _, next) => {
    /**
     * Description. Clips n(count) frames from a valid youtube url.
     */
    try {
      var urls = req.body.urls;
      var count = req.body.count;
      var page = await newPage(req.browser);
      var isUrlsValid = urls.every(u => isYouTubeUrlValid(u));

      if (!isUrlsValid || !count) {
        throw Error('Invalid request params');
      } else {
        req.response = {
          success: true,
          data: {
            ...(await framesMany(page, urls)),
          },
        };

        req.exit_code = 0;
      }
    } catch (e) {
      console.log({ msg: 'Clip error happended' });
      console.log({ e });
      req.exit_code = 1;
      req.response = {
        success: false,
        data: {
          error: e.name,
          message: e.message,
        },
      };
    }
    next();
  },
};