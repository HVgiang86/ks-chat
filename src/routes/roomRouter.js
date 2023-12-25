const express = require('express');
const { getListRoomsByUserId, createRoom } = require('../controller/roomController');
const { verifyToken } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, getListRoomsByUserId);
router.post('/', verifyToken, createRoom);

module.exports = router;
