const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/puzzle');

router.get('/', PuzzleController.getAll);
router.get('/:id', PuzzleController.getById);
router.post('/', PuzzleController.create);
router.patch('/:id', PuzzleController.update);
router.delete('/:id', PuzzleController.delete)

module.exports = router;