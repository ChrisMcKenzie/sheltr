import express from 'express';
import favicon from 'serve-favicon';
import logger from 'morgan';
import path from 'path';
import * as db from './db';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import routes from './routes/index';
import api from './routes/api';

db.setup();

var app = express();

app.use(db.open);

// Uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', api);

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', routes);
// Catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });
}

// Production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {},
  });
});


module.exports = app;
