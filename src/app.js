/**
 * Application main file
 * November 2023
 */

// importing
// const createError = require('http-errors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const yaml = require('yamljs');
const { mongoose } = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes/index');

const app = express();

// Config middlewares
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

// Define routing here
routes(app);

// Swagger setup, do not modify
const swaggerDocument = yaml.load(path.resolve(__dirname, '../swagger.yaml'));

const swaggerUIServe = swaggerUi.serve;
const swaggerUISetup = swaggerUi.setup(swaggerDocument);
app.use('/api-docs', swaggerUIServe, swaggerUISetup);
app.get('/docs', (req, res) => {
  res.redirect(308, '/api-docs');
});
app.get('/', (req, res) => {
  res.redirect(308, '/api-docs');
});

// Default Express code, do not modify
// view engine setup
app.set('views', path.join(__dirname, '../dist/views'));
app.set('view engine', 'ejs');

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404);
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose
  .connect('mongodb+srv://phanhuuviet1:Phanviet2002@ks-chat.gpxd5p0.mongodb.net/')
  .then(() => {
    console.log('Connect success');
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
app.listen(port);
//

module.exports = app;
