const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const roomRouter = require('./roomRouter');

const routes = (app) => {
  app.use('/api/auth', authRouter);
  app.use(userRouter);
  app.use(roomRouter);
};

module.exports = routes;
