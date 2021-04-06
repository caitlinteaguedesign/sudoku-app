const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/puzzle');

router.get('/', PuzzleController.getAll);

module.exports = router;