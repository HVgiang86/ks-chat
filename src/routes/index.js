const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const roomRouter = require('./roomRouter');
const messageRouter = require('./messageRouter');

const routes = (app) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/rooms', roomRouter);
  app.use('/api/message', messageRouter);
};

module.exports = routes;
