'use strict';

const { youtubeVExp } = require('../../bin/constants');
const { newPage, isYouTubeUrlValid } = require('../../bin/utils');
const {
  topComment,
  randomComment,
  allComments
} = require('../../bin/actions');


const commentControllerFactory = async (req, next, func) => {
  /**
   * Description. Create comments controller endpoints.
   */
  try {
    var url = req.body.url;
    var vTag = url.replace(youtubeVExp, '');
    var page = await newPage(req.browser);

    if (!isYouTubeUrlValid(url)) {
      throw Error('Invalid youtube url');
    } else {
      req.response = {
        success: true,
        data: {
          vTag,
          ...(await func(page, url))
        },
      };

      req.exit_code = 0;
    }
  } catch (e) {
    console.log({ e })
    console.log({ msg: 'Comments error happended' });
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
};

module.exports = {

  top: async (req, _, next) => {
    /**
     * Description. Gets the top comment from a valid youtube url.
     */
    await commentControllerFactory(req, next, topComment)
  },

  random: async (req, _, next) => {
    /**
     * Description. Gets a random comment from a valid youtube url.
     */
    await commentControllerFactory(req, next, randomComment)
  },

  all: async (req, _, next) => {
    /**
     * Description. Gets the all comments from a valid youtube url.
     */
    await commentControllerFactory(req, next, allComments)
  },
}