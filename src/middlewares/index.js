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
} = require("./redis");
const {
  createUser,
  makeUsernameKey,
  createPrivateRoom,
  sanitise,
  getMessages,
} = require("./utils");
const {
  createDemoData
} = require("./demo-data");
const {
  PORT,
  SERVER_ID
} = require("./config");

/** Initialize the app */
const initializeMiddleware = async (sessionMiddleware, server) => {
  /** @type {SocketIO.Server} */
  const io =
    /** @ts-ignore */
    require("socket.io")(server);
  const publish = (type, data) => {
    const outgoing = {
      serverId: SERVER_ID,
      type,
      data,
    };
    redisClient.publish("MESSAGES", JSON.stringify(outgoing));
  };

  const initPubSub = () => {
    /** We don't use channels here, since the contained message contains all the necessary data. */
    sub.on("message", (_, message) => {
      /**
       * @type {{
       *   serverId: string;
       *   type: string;
       *   data: object;
       * }}
       **/
      const {
        serverId,
        type,
        data
      } = JSON.parse(message);
      /** We don't handle the pub/sub messages if the server is the same */
      if (serverId === SERVER_ID) {
        return;
      }
      io.emit(type, data);
    });
    sub.subscribe("MESSAGES");
  };
  /** Need to submit the password from the local stuff. */
  await runRedisAuth();
  /** We store a counter for the total users and increment it on each register */
  const totalUsersKeyExist = await exists("total_users");
  if (!totalUsersKeyExist) {
    /** This counter is used for the id */
    await set("total_users", 0);
    /**
     * Some rooms have pre-defined names. When the clients attempts to fetch a room, an additional lookup
     * is handled to resolve the name.
     * Rooms with private messages don't have a name
     */
    await set(`room:${0}:name`, "General");

    /** Create demo data with the default users */
    await createDemoData();
  }
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
    io.on("connection", async (socket) => {
      if (socket.request.session.user === undefined) {
        return;
      }
      const userId = socket.request.session.user.id;
      await sadd("online_users", userId);

      const msg = {
        ...socket.request.session.user,
        online: true,
      };
      console.log("connect");
      publish("user.connected", msg);
      socket.broadcast.emit("user.connected", msg);

      socket.on("room.join", (id) => {
        socket.join(`room:${id}`);
      });

      socket.on(
        "message",
        /**
         * @param {{
         *  from: string
         *  date: number
         *  message: string
         *  roomId: string
         * }} message
         **/
        async (message) => {
          console.log("message");
          /** Make sure nothing illegal is sent here. */
          message = {
            ...message,
            message: sanitise(message.message)
          };
          /**
           * The user might be set as offline if he tried to access the chat from another tab, pinging by message
           * resets the user online status
           */
          await sadd("online_users", message.from);
          /** We've got a new message. Store it in db, then send back to the room. */
          const messageString = JSON.stringify(message);
          const roomKey = `room:${message.roomId}`;
          /**
           * It may be possible that the room is private and new, so it won't be shown on the other
           * user's screen, check if the roomKey exist. If not then broadcast message that the room is appeared
           */
          const isPrivate = !(await exists(`${roomKey}:name`));
          const roomHasMessages = await exists(roomKey);
          if (isPrivate && !roomHasMessages) {
            const ids = message.roomId.split(":");
            const msg = {
              id: message.roomId,
              names: [
                await hmget(`user:${ids[0]}`, "username"),
                await hmget(`user:${ids[1]}`, "username"),
              ],
            };
            publish("show.room", msg);
            socket.broadcast.emit(`show.room`, msg);
          }
          await zadd(roomKey, "" + message.date, messageString);
          publish("message", message);
          io.to(roomKey).emit("message", message);
        }
      );
      socket.on("disconnect", async () => {
        console.log("dis");
        const userId = socket .request.session.user.id;
        await srem("online_users", userId);
        const msg = {
          ...socket.request.session.user,
          online: false,
        };
        publish("user.disconnected", msg);
        socket.broadcast.emit("user.disconnected", msg);
      });
    });

  }
};
module.exports = {
  initializeMiddleware
};