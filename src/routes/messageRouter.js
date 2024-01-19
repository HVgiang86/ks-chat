const express = require('express');
const { getMessageByRoomId, postMessage } = require('../controller/messageController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, getMessageByRoomId);

router.post('/', verifyToken, postMessage);

module.exports = router;
