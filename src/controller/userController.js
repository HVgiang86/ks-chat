const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    validateEmail
} = require('../utils/validateField');
const {
    generateAccessToken
} = require('../services/jwtService');
const dotenv = require('dotenv').config();
const {
    client: redisClient,
    exists,
    set,
    get,
    hgetall,
    sadd,
    zadd,
    hmget,
    smembers,
    sismember,
    srem,
    sub,
    auth: runRedisAuth,
} = require("../middlewares/redis");
const {
    createUser,
    makeUsernameKey,
    createPrivateRoom,
    sanitise,
    getMessages,
} = require("../middlewares/utils");
const session = require("express-session");

const auth = (req, res, next) => {
    if (!req.session.user) {
      return res.sendStatus(403);
    }
    next();
  };


const randomName = async (req, res, next) => {
    return res.send(randomName({
        first: true
    }));
};

const usersOnline = async (req, res, next) => {
    const onlineIds = await smembers(`online_users`);
    const users = {};
    for (let onlineId of onlineIds) {
        const user = await hgetall(`user:${onlineId}`);
        users[onlineId] = {
            id: onlineId,
            username: user.username,
            online: true,
        };
    }
    return res.send(users);
};

const users = async (req, res, next) => {
    /** @ts-ignore */
    /** @type {string[]} */
    const ids = req.query.ids;
    if (typeof ids === "object" && Array.isArray(ids)) {
        /** Need to fetch */
        const users = {};
        for (let x = 0; x < ids.length; x++) {
            /** @type {string} */
            const id = ids[x];
            const user = await hgetall(`user:${id}`);
            users[id] = {
                id: id,
                username: user.username,
                online: !!(await sismember("online_users", id)),
            };
        }
        return res.send(users);
    }
    return res.sendStatus(404);
};

const me = async (req, res, next) => {
    /** @ts-ignore */
    const {
        user
    } = req.session;
    if (user) {
        return res.json(user);
    }
    /** User not found */
    return res.json(null);
};

module.exports = {
    randomName,
    usersOnline,
    users,
    me
};