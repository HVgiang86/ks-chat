const express = require('express');
const { getMe, getUserById, updateUser, changePasswordUser, shareProfile } = require('../controller/userController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', verifyToken, getMe);
router.get('/:id', getUserById);

router.post('/share-profile', verifyToken, shareProfile);

router.put('/update', verifyToken, updateUser);
router.put('/change-password', verifyToken, changePasswordUser);

module.exports = router;
