const express = require('express');
const router = express.Router();

const checkEmail = require('../middleware/check-email');

const UserController = require('../controllers/user');

router.get('/', UserController.getAll);
router.post('/register', checkEmail, UserController.register);
router.post('/login', UserController.login);

router.get('/unverified', UserController.getUnverified);
router.delete('/unverified', UserController.deleteUnverified);

router.get('/id/:id', UserController.getById);
router.get('/id/:id/settings', UserController.getSettingsById);
router.patch('/id/:id', checkEmail, UserController.update);
router.delete('/id/:id', UserController.delete);

router.post('/id/:id/addPuzzle', UserController.addPuzzleList);
router.patch('/id/:id/updatePuzzle', UserController.updatePuzzleList);
router.patch('/id/:id/pullPuzzle', UserController.pullFromPuzzleList);


module.exports = router;