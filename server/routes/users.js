const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);
router.get('/:id/liked', userController.getLikedSongs);
router.post('/:id/liked', userController.likeSong);
router.delete('/:id/liked/:songId', userController.unlikeSong);
router.get('/:id/playlists', userController.getUserPlaylists);

module.exports = router;
