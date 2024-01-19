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
  zaddEmpty,
} = require('./redis');
const { createUser, makeUsernameKey, createPrivateRoom, sanitise, getMessages } = require('./utils');
const { createDemoData } = require('./demo-data');
const { PORT, SERVER_ID } = require('./config');

const { random } = require('../utils/NameUtils');

const { md5Hash } = require('../utils/StringUtils');
var validationRegex = new RegExp('^[0-9a-fA-F]{24}$');
const chatRequestController = require('../controller/chatRequestController');
const roomService = require('../services/roomService');
const messageService = require('../services/messageService');
const { STATUS } = require('../common/Socket');
const { createResponseMessage } = require('../utils/ResponseSocket');

const ACTIVE_STATUS = 'ACTIVE';
const INACTIVE_STATUS = 'INACTIVE';

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

      socket.on('login', async (data) => {
        try {
          console.log(`LOGIN REQUEST:\t${data}`);

          data = JSON.parse(data);
          console.log(data);
          userId = data.uid;

          if (!userId || !validationRegex.test(userId)) {
            console.log('INVALID REQUEST');
            socket.emit('login', createResponseMessage(STATUS.INVALID_REQUEST, {}));
            return;
          }
          const rooms = await roomService.getActiveRoomsByUserId(userId);
          console.log(`GET ACTIVE ROOM: ${rooms}`);
          if (rooms) {
            console.log(`GET ACTIVE ROOM: len:${rooms.length}`);
            rooms.forEach((room) => {
              const userIdArray = [room.user1.id, room.user2.id];
              userIdArray.sort();
              const roomKey = 'room' + md5Hash(userIdArray.join(''));
              console.log(roomKey);
              console.log(`GET ACTIVE ROOM: ${userIdArray}`);
              socket.join(roomKey);
            });
          } else if (typeof rooms === 'object') {
            const userIdArray = [rooms.user1.id, rooms.user2.id];
            userIdArray.sort();
            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            console.log(roomKey);
            console.log(`GET ACTIVE ROOM: ${userIdArray}`);
            socket.join(roomKey);
          }

          socket.emit('login', createResponseMessage(STATUS.SUCCESS, data));
        } catch (error) {
          console.log(error);
          socket.emit('login', createResponseMessage(STATUS.ERROR, {}));
        }
      });

      socket.on('request_chat', () => {
        try {
          console.log(`REQUEST_CHAT REQUEST:\t`);
          chatRequestController.addNewRequest(userId, async (match_result) => {
            console.log('emit response');
            const id1 = match_result[0];
            const id2 = match_result[1];
            let partner_id = id2;
            if (userId == id2) partner_id = id1;

            const result = {
              message: 'matched',
              partner_id: partner_id,
            };
            const checkCreate = userId > partner_id;
            const existingActiveRoom = await roomService.getRoomsBetweenUserId(userId, partner_id, ACTIVE_STATUS);
            console.log(`EXISTING ACTIVE Room ${existingActiveRoom}`);
            if (existingActiveRoom) {
              socket.emit('request_chat', createResponseMessage(STATUS.INVALID_REQUEST, {}));
              return;
            }

            const existingInactiveRoom = await roomService.getRoomsBetweenUserId(userId, partner_id, INACTIVE_STATUS);
            console.log(`EXISTING inACTIVE Room ${existingInactiveRoom}`);
            if (existingInactiveRoom) {
              await roomService.enableRoom(userId, partner_id, INACTIVE_STATUS);
            } else {
              if (checkCreate) {
                const randomObject = await random(id1, id2);
                const room = await roomService.createRoomObject(randomObject);
                console.log(room);
              }
            }

            const userIdArray = [id1, id2];
            userIdArray.sort();
            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            console.log(roomKey);
            // await zaddEmpty(roomKey);
            socket.join(roomKey);
            socket.emit('request_chat', createResponseMessage(STATUS.SUCCESS, result));
            // socket.emit('request_chat', JSON.stringify(result, null, 4));
          });
        } catch (e) {
          console.log(e);
          socket.emit('request_chat', createResponseMessage(STATUS.ERROR, {}));
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
          try {
            console.log(`MESSAGE REQUEST:\t${message}`);
            message = JSON.parse(message);

            if (!message.sender_id || !message.receiver_id || !message.content) {
              console.log('INVALID REQUEST');
              socket.emit('message', createResponseMessage(STATUS.INVALID_REQUEST, {}));
              return;
            }
            const date = new Date();
            message.date = date.getTime();
            /** Make sure nothing illegal is sent here. */
            message = {
              ...message,
              content: sanitise(message.content),
            };

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
            await messageService.createMessage({
              sender: sender_id,
              receiver: receiver_id,
              message: message.content,
              roomId: roomKey,
              type: 'message',
            });
            io.to(roomKey).emit('message', createResponseMessage(STATUS.SUCCESS, message));
          } catch (error) {
            console.log(error);
            socket.emit('message', createResponseMessage(STATUS.ERROR, {}));
          }
        }
      );

      socket.on(
        'notification_message',
        /**
         * @param {{
         *  sender_id : string
         *  receiver_id : string
         *  date: date
         *  content: string
         * }} message
         **/
        async (message) => {
          try {
            console.log(`MESSAGE REQUEST:\t${message}`);
            message = JSON.parse(message);

            if (!message.sender_id || !message.receiver_id || !message.content) {
              console.log('INVALID REQUEST');
              socket.emit('notification_message', createResponseMessage(STATUS.INVALID_REQUEST, {}));
              return;
            }
            const date = new Date();
            message.date = date.getTime();
            /** Make sure nothing illegal is sent here. */
            message = {
              ...message,
              content: sanitise(message.content),
            };

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
            await messageService.createMessage({
              sender: sender_id,
              receiver: receiver_id,
              message: message.content,
              roomId: roomKey,
              type: 'notification',
            });
            io.to(roomKey).emit('notification_message', createResponseMessage(STATUS.SUCCESS, message));
          } catch (error) {
            console.log(error);
            socket.emit('notification_message', createResponseMessage(STATUS.ERROR, {}));
          }
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
          try {
            console.log(`SEND_IMAGE REQUEST:\t${message}`);

            message = JSON.parse(message);

            /** Make sure nothing illegal is sent here. */
            if (!message.sender_id || !message.receiver_id || !message.url) {
              console.log('INVALID REQUEST');
              socket.emit('send_image', createResponseMessage(STATUS.INVALID_REQUEST, {}));
              return;
            }
            const date = new Date();
            message.date = date.getTime();
            message = {
              ...message,
              url: sanitise(message.url),
            };
            const messageString = JSON.stringify(message);
            const sender_id = message.sender_id.toString();
            const receiver_id = message.receiver_id.toString();
            const userIdArray = [sender_id, receiver_id];
            userIdArray.sort();
            console.log(userIdArray);
            const roomKey = 'room' + md5Hash(userIdArray.join(''));

            console.log(roomKey);
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
            await messageService.createMessage({
              sender: sender_id,
              receiver: receiver_id,
              message: message.url,
              roomId: roomKey,
              type: 'send_image',
            });
            io.to(roomKey).emit('send_image', createResponseMessage(STATUS.SUCCESS, message));
          } catch (error) {
            console.log(error);
            socket.emit('send_image', createResponseMessage(STATUS.ERROR, {}));
          }
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
          try {
            console.log(`SHARE_PROFILE REQUEST:\t${message}`);

            message = JSON.parse(message);

            const sender_id = message.sender_id.toString();
            const receiver_id = message.receiver_id.toString();

            const userIdArray = [sender_id, receiver_id];
            userIdArray.sort();
            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            const roomExists = await exists(roomKey);
            console.log(roomKey);

            const room = await roomService.getRoomsBetweenUserId(sender_id, receiver_id, ACTIVE_STATUS);
            if (roomExists || room) {
              const msg = {
                id: roomKey,
                names: [await hmget(`user:${receiver_id}`, 'username'), await hmget(`user:${sender_id}`, 'username')],
              };
              publish('show.room', msg);
              socket.broadcast.emit(`show.room`, msg);
              io.to(roomKey).emit('share_profile', message);
              await roomService.updateRoomToShareProfile(sender_id, receiver_id, sender_id);
              publish('share_profile', message);
            } else {
              console.log('Dont exits room');
            }
          } catch (error) {
            console.log(error);
            socket.emit('share_profile', createResponseMessage(STATUS.ERROR, {}));
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
          try {
            console.log(`END_CHAT REQUEST:\t${message}`);

            message = JSON.parse(message);

            const uid = message.sender_id.toString();
            console.log('END_CHAT uid: ' + uid);
            console.log('END_CHAT uid: ' + message.partner_id);
            const partner_id = message.partner_id.toString();

            const userIdArray = [uid, partner_id];
            userIdArray.sort();
            const roomKey = 'room' + md5Hash(userIdArray.join(''));
            const messageEmit = {
              partner_id: partner_id,
            };
            console.log(roomKey);
            const roomExists = await exists(roomKey);
            const room = await roomService.getRoomsBetweenUserId(uid, partner_id, ACTIVE_STATUS);
            if (roomExists || room) {
              const res = await roomService.disableRoom(uid, partner_id, ACTIVE_STATUS);
              console.log(res);
              if (res) {
                console.log('deleted');
                io.to(roomKey).emit('end_chat', messageEmit);
                publish('end_chat', message);
              }
            } else {
              console.log('Dont exits room');
            }
          } catch (error) {
            console.log(error);
            socket.emit('end_chat', createResponseMessage(STATUS.ERROR, {}));
          }
        }
      );

      // socket.on('disconnect', async () => {
      //   console.log('dis');
      //   const userId = socket.request.session.user.id;
      //   await srem('online_users', userId);
      //   const msg = {
      //     ...socket.request.session.user,
      //     online: false,
      //   };
      //   publish('user.disconnected', msg);
      //   socket.broadcast.emit('user.disconnected', msg);
      // });
    });
  }
};
module.exports = {
  initializeMiddleware,
};
