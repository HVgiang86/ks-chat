const express = require('express');
const { room, preload, messages, user } = require('../controller/roomController');

const router = express.Router();

router.post('/room', room);
router.get('/room/0/preload', preload);
router.get('/room/:id/messages', messages);
router.get('/rooms/:userId', user);

module.exports = router;
