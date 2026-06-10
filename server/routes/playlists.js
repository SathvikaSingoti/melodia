const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);
router.post('/', playlistController.createPlaylist);
router.get('/:id', playlistController.getPlaylist);
router.post('/:id/songs', playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', playlistController.removeSongFromPlaylist);

module.exports = router;
