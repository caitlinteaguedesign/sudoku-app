const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/puzzle');

router.get('/', PuzzleController.getAll);
router.get('/:id', PuzzleController.getById);
router.post('/', PuzzleController.create);

module.exports = router;