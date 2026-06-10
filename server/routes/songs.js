const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/search', songController.searchSongs);
router.get('/', songController.getSongs);

module.exports = router;
