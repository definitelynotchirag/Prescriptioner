const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.getUsers);
router.post('/create', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;