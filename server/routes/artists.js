const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);
router.get('/:id', artistController.getArtist);

module.exports = router;
