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
} = require('./redis');
const { createUser, makeUsernameKey, createPrivateRoom, sanitise, getMessages } = require('./utils');
const { createDemoData } = require('./demo-data');
const { PORT, SERVER_ID } = require('./config');

const { md5Hash } = require('../utils/StringUtils');

const chatRequestController = require('../controller/chatRequestController');
const roomService = require('../services/roomService');

/** Initialize the app */
const initializeMiddleware = async (sessionMiddleware, server) => {
  /** @type {SocketIO.Server} */
  const io =
    /** @ts-ignore */
    require('socket.io')(server);
  const publish = (type, data) => {
    const outgoing = {
      serverId: SERVER_ID,
      type,
      data,
    };
    redisClient.publish('MESSAGES', JSON.stringify(outgoing));
  };

  const initPubSub = () => {
    /** We don't use channels here, since the contained message contains all the necessary data. */
    sub.on('message', (_, message) => {
      /**
       * @type {{
       *   serverId: string;
       *   type: string;
       *   data: object;
       * }}
       **/
      const { serverId, type, data } = JSON.parse(message);
      /** We don't handle the pub/sub messages if the server is the same */
      if (serverId === SERVER_ID) {
        return;
      }
      io.emit(type, data);
    });
    sub.subscribe('MESSAGES');
  };
  /** Need to submit the password from the local stuff. */
  await runRedisAuth();
  /** We store a counter for the total users and increment it on each register */
  // const totalUsersKeyExist = await exists("total_users");
  // if (!totalUsersKeyExist) {
  //   /** This counter is used for the id */
  //   await set("total_users", 0);
  //   /**
  //    * Some rooms have pre-defined names. When the clients attempts to fetch a room, an additional lookup
  //    * is handled to resolve the name.
  //    * Rooms with private messages don't have a name
  //    */
  //   await set(`room:${0}:name`, "General");

  //   /** Create demo data with the default users */
  //   await createDemoData();
  // }
  /** Once the app is initialized, run the server */
  runApp();

  async function runApp() {
    initPubSub();
    /** Store session in redis. */
    io.use((socket, next) => {
      /** @ts-ignore */
      sessionMiddleware(socket.request, socket.request.res || {}, next);
      // sessionMiddleware(socket.request, socket.request.res, next); will not work with websocket-only
      // connections, as 'socket.request.res' will be undefined in that case
    });
    io.on('connection', async (socket) => {
      console.log('Connected socket');
      let userId;
      // const userId = socket.request.session.user.id;
      // await sadd("online_users", userId);

      // const msg = {
      //   ...socket.request.session.user,
      //   online: true,
      // };
      // console.log("connect");
      // publish("user.connected", msg);
      // socket.broadcast.emit("user.connected", msg);

      socket.on('room.join', (id) => {
        socket.join(`room:${id}`);
      });

      socket.on('login', async (data) => {
        data = {
          ...data,
        };
        const dataObject = JSON.stringify(data);
        console.log(dataObject);
        userId = data.uid;
        console.log(userId);
        const rooms = await roomService.getListRoomsByUserId(userId);
        if (rooms) {
          rooms.forEach((room) => {
            const userIdArray = [room.user1.id, room.user2.id];
            userIdArray.sort();
            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            console.log(roomKey);
            socket.join(roomKey);
          });
        }

        const response = {
          message: 'login successfully',
        };
        socket.emit('login', JSON.stringify(response, null, 4));
      });

      let roomCreatedCount = 0;
      socket.on('request_chat', () => {
        try {
          chatRequestController.addNewRequest(userId, async (match_result) => {
            roomCreatedCount++;
            console.log('emit response');
            const id1 = match_result[0];
            const id2 = match_result[1];
            let partner_id = id2;
            if (userId == id2) partner_id = id1;

            const result = {
              message: 'matched',
              partner_id: partner_id,
            };

            // await zadd(roomKey, "" + message.date, messageString);
            const userIdArray = [id1, id2];
            userIdArray.sort();

            if (roomCreatedCount % 2 == 1) {
              const room = await roomService.createRoom(userIdArray[0], userIdArray[1]);
              console.log(room);
            }

            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            console.log(roomKey);
            socket.join(roomKey);
            socket.emit('request_chat', JSON.stringify(result, null, 4));
          });
        } catch (e) {
          console.log(e);
        }
      });

      socket.on('disconnect', () => {
        chatRequestController.cancelRequest(userId);
      });

      socket.on('cancel_request_chat', () => {
        chatRequestController.cancelRequest(userId);
      });

      socket.on(
        'message',
        /**
         * @param {{
         *  sender_id : string
         *  receiver_id : string
         *  date: date
         *  content: string
         * }} message
         **/
        async (message) => {
          const date = new Date();
          message.date = date.getTime();
          /** Make sure nothing illegal is sent here. */
          message = {
            ...message,
            content: sanitise(message.content),
          };
          /**
           * The user might be set as offline if he tried to access the chat from another tab, pinging by message
           * resets the user online status
           */
          // await sadd("online_users", message.from);
          // /** We've got a new message. Store it in db, then send back to the room. */
          const messageString = JSON.stringify(message);
          console.log(messageString);
          const sender_id = message.sender_id.toString();
          const receiver_id = message.receiver_id.toString();
          console.log(receiver_id);
          console.log(sender_id);
          const userIdArray = [sender_id, receiver_id];
          userIdArray.sort();
          console.log(userIdArray);
          const roomKey = 'room' + md5Hash(userIdArray.join(''));
          console.log(roomKey);
          // /**
          //  * It may be possible that the room is private and new, so it won't be shown on the other
          //  * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
          //  */
          // const isPrivate = !(await exists(`${roomKey}:name`));
          const roomHasMessages = await exists(roomKey);
          if (!roomHasMessages) {
            const msg = {
              id: roomKey,
              names: [await hmget(`user:${receiver_id}`, 'username'), await hmget(`user:${sender_id}`, 'username')],
            };
            publish('show.room', msg);
            socket.broadcast.emit(`show.room`, msg);
          }
          socket.join(roomKey);
          await zadd(roomKey, '' + message.date, messageString);
          publish('message', message);
          io.to(roomKey).emit('message', message);
        }
      );

      socket.on(
        'send_image',
        /**
         * @param {{
         *  sender_id : string
         *  receiver_id : string
         *  date: date
         *  url: string
         * }} message
         **/
        async (message) => {
          console.log(message);
          /** Make sure nothing illegal is sent here. */
          message = {
            ...message,
            url: sanitise(message.url),
          };
          /**
           * The user might be set as offline if he tried to access the chat from another tab, pinging by message
           * resets the user online status
           */
          // await sadd("online_users", message.from);
          // /** We've got a new message. Store it in db, then send back to the room. */
          const messageString = JSON.stringify(message);
          const sender_id = message.sender_id.toString();
          const receiver_id = message.receiver_id.toString();
          const roomKey = 'room' + md5Hash(receiver_id + sender_id);
          console.log(roomKey);
          // /**
          //  * It may be possible that the room is private and new, so it won't be shown on the other
          //  * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
          //  */
          // const isPrivate = !(await exists(`${roomKey}:name`));
          const roomHasMessages = await exists(roomKey);
          if (!roomHasMessages) {
            const msg = {
              id: roomKey,
              names: [await hmget(`user:${receiver_id}`, 'username'), await hmget(`user:${sender_id}`, 'username')],
            };
            publish('show.room', msg);
            socket.broadcast.emit(`show.room`, msg);
          }
          await zadd(roomKey, '' + message.date, messageString);
          publish('send_image', message);
          io.to(roomKey).emit('send_image', message);
        }
      );

      socket.on(
        'share_profile',
        /**
         * @param {{
         *  sender_id : string
         *  receiver_id : string
         *  date: date
         * }} message
         **/
        async (message) => {
          console.log(message);
          /**
           * The user might be set as offline if he tried to access the chat from another tab, pinging by message
           * resets the user online status
           */
          // await sadd("online_users", message.from);
          // /** We've got a new message. Store it in db, then send back to the room. */
          const messageString = JSON.stringify(message);
          const sender_id = message.sender_id.toString();
          const receiver_id = message.receiver_id.toString();
          const roomKey = 'room' + md5Hash(receiver_id + sender_id);
          console.log(roomKey);
          // /**
          //  * It may be possible that the room is private and new, so it won't be shown on the other
          //  * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
          //  */
          // const isPrivate = !(await exists(`${roomKey}:name`));
          const roomExists = await exists(roomKey);
          if (roomExists) {
            const msg = {
              id: roomKey,
              names: [await hmget(`user:${receiver_id}`, 'username'), await hmget(`user:${sender_id}`, 'username')],
            };
            publish('show.room', msg);
            socket.broadcast.emit(`show.room`, msg);
            io.to(roomKey).emit('share_profile', message);
            publish('share_profile', message);
          } else {
            console.log('Dont exits room');
          }
        }
      );

      socket.on(
        'end_chat',
        /**
         * @param {{
         *  uid : string
         *  partner_id : string
         *  date: date
         * }} message
         **/
        async (message) => {
          console.log(message);
          /**
           * The user might be set as offline if he tried to access the chat from another tab, pinging by message
           * resets the user online status
           */
          // await sadd("online_users", message.from);
          // /** We've got a new message. Store it in db, then send back to the room. */
          const messageString = JSON.stringify(message);

          const uid = message.uid.toString();
          const partner_id = message.partner_id.toString();
          const roomKey = 'room' + md5Hash(uid + partner_id);
          const messageEmit = {
            partner_id: partner_id,
          };
          console.log(roomKey);

          // /**
          //  * It may be possible that the room is private and new, so it won't be shown on the other
          //  * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
          //  */
          // const isPrivate = !(await exists(`${roomKey}:name`));
          const roomExists = await exists(roomKey);
          if (roomExists) {
            const res = await roomService.deleteRoom(uid, partner_id);
            console.log(res);
            if (res.deletedCount !== 0) {
              console.log('deleted');
              io.to(roomKey).emit('end_chat', messageEmit);
              publish('end_chat', message);
            }
          } else {
            console.log('Dont exits room');
          }
        }
      );

      socket.on('disconnect', async () => {
        console.log('dis');
        const userId = socket.request.session.user.id;
        await srem('online_users', userId);
        const msg = {
          ...socket.request.session.user,
          online: false,
        };
        publish('user.disconnected', msg);
        socket.broadcast.emit('user.disconnected', msg);
      });
    });
  }
};
module.exports = {
  initializeMiddleware,
};
