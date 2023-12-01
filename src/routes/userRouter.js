const express = require('express');
const { getMe, getUserById, updateUser } = require('../controller/userController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.get('/:id', getUserById);

router.put('/update', verifyToken, updateUser);

module.exports = router;
