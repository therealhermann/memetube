'use strict';

const { newPage, isYouTubeUrlValid } = require('../../bin/utils');
const {
  framesRandomComment,
  framesTopComment,
  screenshot,
} = require('../../bin/actions');

const memeControllerFactory = async (req, next, func) => {
  /**
   * Description. MemeFactory that combine the clips and comments into different meme types.
   */
  try {
    var url = req.body.url;
    var page = await newPage(req.browser);

    if (!isYouTubeUrlValid(url)) {
      throw Error('Invalid youtube url');
    } else {
      req.response = {
        success: true,
        data: {
          ...(await func(page, url)),
        },
      };

      req.exit_code = 0;
    }
  } catch (e) {
    console.log({ msg: 'Meme error happended' });
    req.exit_code = 1;
    req.response = {
      success: false,
      data: {
        error: e.name,
        message: e.message,
      },
    };
    throw e;
  }
  next();
};


module.exports = {
  top: async (req, _, next) => {
    /**
     * Description. Gets a random clip and the top comment from a valid youtube url.
     */
    await memeControllerFactory(req, next, framesTopComment);
  },

  random: async (req, _, next) => {
    /**
     * Description. Gets a random clip and a random comment from a valid youtube url.
     */
    await memeControllerFactory(req, next, framesRandomComment);
  }
};