#!/usr/bin/env node
var debug = require('debug')('sheltr');
var app = require('./src/webserver');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
