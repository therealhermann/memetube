'use strict';

const express = require('express');
const router = express.Router();

const comment = require('../controller/comment');

router.post('/top', comment.top);
router.post('/random', comment.random);
router.post('/all', comment.all);

module.exports = router;