const express = require('express');
const router = express.Router();

const checkEmail = require('../middleware/check-email');
const UserController = require('../controllers/user');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.create);
router.patch('/:id', checkEmail, UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;