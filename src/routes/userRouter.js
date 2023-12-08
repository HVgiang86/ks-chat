const express = require('express');
const { getMe, getUserById, updateUser, changePasswordUser } = require('../controller/userController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.get('/:id', getUserById);

router.put('/update', verifyToken, updateUser);
router.put('/change-password', verifyToken, changePasswordUser);

module.exports = router;
