const express = require('express');
const router = express.Router();

const checkEmail = require('../middleware/check-email');
const UserController = require('../controllers/user');

router.get('/', UserController.getAll);
router.post('/', checkEmail, UserController.create);
router.delete('/unverified', UserController.deleteUnverified);

router.get('/id/:id', UserController.getById);
router.patch('/id/:id', checkEmail, UserController.update);
router.delete('/id/:id', UserController.delete);


module.exports = router;