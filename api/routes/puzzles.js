const express = require('express');
const router = express.Router();

const PuzzleController = require('../controllers/puzzle');

router.get('/', PuzzleController.getAll);
router.post('/', PuzzleController.create);

router.get('/id/:id', PuzzleController.getById);
router.patch('/id/:id', PuzzleController.update);
router.delete('/id/:id', PuzzleController.delete)

module.exports = router;