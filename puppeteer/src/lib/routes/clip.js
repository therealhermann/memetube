'use strict';

const express = require('express');
const router = express.Router();

const clip = require('../controller/clip');

router.post('/frame', clip.frame);
router.post('/frame/at', clip.frameAt)
router.post('/frames', clip.frames);

module.exports = router;