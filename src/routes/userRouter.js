const express = require('express');
const { randomName, usersOnline, users, me } = require('../controller/userController');

const router = express.Router();

router.get('/randomName', randomName);
router.get('/users/online', usersOnline);
router.get('/users', users);
router.get('/me', me);

module.exports = router;
