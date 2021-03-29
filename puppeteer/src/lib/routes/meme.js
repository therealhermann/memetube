'use strict';

const express = require('express');
const router = express.Router();

const tailor = require('../controller/meme');

router.post('/top', tailor.top);
router.post('/random', tailor.random);

module.exports = router;