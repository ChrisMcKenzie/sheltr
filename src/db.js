'use strict';

import r from 'rethinkdb';
import config from './config';
import util from 'util';
import assert from 'assert';

var logdebug = require('debug')('sheltr:rdb:debug');
var logerror = require('debug')('sheltr:rdb:error');

export function connect(hollaback) {
  r.connect({
    host: config.db.host,
    port: config.db.port,
    db: config.db.name,
  }, function(err, result) {
    if (err) {
      logerror('[ERROR] RethinkDB database is not available');
      hollaback(err);
    } else {
      logdebug('[INFO ] RethinkDB is connected');
      hollaback(err, result);
    }
  });
}

export function setup(cb) {
  connect(function(err, connection) {
    function createTable(tbl) {
      var primary = config.db.tables[tbl];
      var secondary;

      function createIndex(indexName) {
        r.db(config.db.name)
         .table(tbl).indexCreate(indexName, secondary[indexName])
         .run(connection, function(err, result) {
          if (err) {
            logdebug(
              '[DEBUG] RethinkDB table index "%s" already \
              exists (%s:%s)\n%s',
              indexName,
              err.name,
              err.msg,
              err.message
            );
          } else {
            logdebug('[INFO ] RethinkDB table index "%s" created', indexName);
          }
        });
      }

      if (typeof config.db.tables[tbl] === 'object') {
        primary = config.db.tables[tbl].primary || 'id';
        secondary = config.db.tables[tbl].secondary || null;
      }

      r.db(config.db.name)
       .tableCreate(tbl, {primaryKey: primary})
       .run(connection, function(err, result) {
        if (err) {
          logdebug(
            '[DEBUG] RethinkDB table "%s" \
            already exists (%s:%s)\n%s',
            tbl,
            err.name,
            err.msg,
            err.message
          );
        } else {
          logdebug('[INFO ] RethinkDB table "%s" created', tbl);
        }

        if (secondary !== null) {
          for (let idx in secondary) {
            createIndex(idx);
          }
        }
      });
    }

    assert.ok(err === null, err);
    r.dbCreate(config.db.name).run(connection, function(err, result) {
      if (err) {
        logdebug(
          '[DEBUG] RethinkDB database "%s" \
          already exists (%s:%s)\n%s',
          config.db.name,
          err.name,
          err.msg,
          err.message
        );
      } else {
        logdebug('[INFO ] RethinkDB database "%s" created', config.db.name);
      }

      for (var tbl in config.db.tables) {
        createTable(tbl);
      }

      if (cb) cb();
    });
  });
}

export function open(req, res, next) {
  connect(function(error, conn) {
    if (error) {
      res.status(500);
      next(error);
    } else {
      // Save the connection in `req`
      req._rdbConn = conn;
      // Pass the current request to the next middleware
      next();
    }
  });
}

export function close(req, res, next) {
  req._rdbConn.close();
  next();
}
