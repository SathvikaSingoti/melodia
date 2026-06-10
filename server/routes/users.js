const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// In a real app we would use verifyJWT here, but keeping it open for quick dev
router.get('/:id/liked', userController.getLikedSongs);
router.post('/:id/liked', userController.likeSong);
router.delete('/:id/liked/:songId', userController.unlikeSong);
router.get('/:id/playlists', userController.getUserPlaylists);

module.exports = router;
