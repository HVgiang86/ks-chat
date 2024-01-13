const express = require('express');
const { getMessageByRoomId } = require('../controller/messageController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, getMessageByRoomId);

module.exports = router;
