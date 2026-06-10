const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);
router.post('/', playlistController.createPlaylist);

module.exports = router;
