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

const room = async (req, res, next) => {
    const { user1, user2 } = {
        user1: parseInt(req.body.user1),
        user2: parseInt(req.body.user2),
      };
  
      const [result, hasError] = await createPrivateRoom(user1, user2);
      if (hasError) {
        return res.sendStatus(400);
      }
      return res.status(201).send(result);
  };


const preload = async (req, res, next) => {
    const roomId = "0";
    try {
      let name = await get(`room:${roomId}:name`);
      const messages = await getMessages(roomId, 0, 20);
      return res.status(200).send({ id: roomId, name, messages });
    } catch (err) {
      return res.status(400).send(err);
    }
};

const messages = async (req, res, next) => {
    const roomId = req.params.id;
    // @ts-ignore
    const offset = +req.query.offset;
    // @ts-ignore
    const size = +req.query.size;
    try {
      const messages = await getMessages(roomId, offset, size);
      return res.status(200).send(messages);
    } catch (err) {
      return res.status(400).send(err);
    }
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

const user = async (req, res, next) => {
    const userId = req.params.userId;
    /** We got the room ids */
    const roomIds = await smembers(`user:${userId}:rooms`);
    const rooms = [];
    for (let x = 0; x < roomIds.length; x++) {
      const roomId = roomIds[x];

      let name = await get(`room:${roomId}:name`);
      /** It's a room without a name, likey the one with private messages */
      if (!name) {
        /**
         * Make sure we don't add private rooms with empty messages
         * It's okay to add custom (named rooms)
         */
        const roomExists = await exists(`room:${roomId}`);
        if (!roomExists) {
          continue;
        }

        const userIds = roomId.split(":");
        if (userIds.length !== 2) {
          return res.sendStatus(400);
        }
        rooms.push({
          id: roomId,
          names: [
            await hmget(`user:${userIds[0]}`, "username"),
            await hmget(`user:${userIds[1]}`, "username"),
          ],
        });
      } else {
        rooms.push({ id: roomId, names: [name] });
      }
    }
    res.status(200).send(rooms);
};

module.exports = {
    room, preload, messages, user
};