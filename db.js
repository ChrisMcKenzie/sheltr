var r = require('rethinkdb');
var config = require(__dirname + '/config');
var util = require('util');
var assert = require('assert');
var logdebug = require('debug')('app:rdb:debug');
var logerror = require('debug')('app:rdb:error');

export function connect(hollaback){
  r.connect({
    host: config.db.host,
    port: config.db.port,
    db: config.db.name
  }, function(err, result){
    if(err){
      logerror('[ERROR] RethinkDB database is not available');
      hollaback(err);
    } else {
      logdebug('[INFO ] RethinkDB is connected')
      hollaback(err, result);
    }
  });
}

export function setup() {
  connect(function (err, connection) {
    assert.ok(err === null, err);
    r.dbCreate(config.db.name).run(connection, function(err, result) {
      if(err) {
        logdebug("[DEBUG] RethinkDB database '%s' already exists (%s:%s)\n%s", config.db.name, err.name, err.msg, err.message);
      }
      else {
        logdebug("[INFO ] RethinkDB database '%s' created", config.db.name);
      }

      for(var tbl in config.db.tables) {
        (function (tableName) {
          var primary = config.db.tables[tbl];
          var secondary;
          if(typeof config.db.tables[tbl] == 'object') {
            primary = config.db.tables[tbl].primary || 'id'
            secondary = config.db.tables[tbl].secondary || null
          }

          r.db(config.db.name).tableCreate(tableName, {primaryKey: primary}).run(connection, function(err, result) {
            if(err) {
              logdebug("[DEBUG] RethinkDB table '%s' already exists (%s:%s)\n%s", tableName, err.name, err.msg, err.message);
            }
            else {
              logdebug("[INFO ] RethinkDB table '%s' created", tableName);
            }

            if(secondary !== null) {
              for(var idx in secondary){
                (function(indexName){
                  r.db(config.db.name).table(tableName).indexCreate(indexName, secondary[indexName]).run(connection, function(err, result){
                    if(err) {
                      logdebug("[DEBUG] RethinkDB table index '%s' already exists (%s:%s)\n%s", idx, err.name, err.msg, err.message);
                    }
                    else {
                      logdebug("[INFO ] RethinkDB table index '%s' created", idx);
                    }
                  });
                })(idx)
              };
            }
          });
        })(tbl);
      }
    });
  });
};

export function open(req, res, next) {
  connect(function(error, conn) {
    if (error) {
      res.status(500);
      next(error);
    }
    else {
      // Save the connection in `req`
      req._rdbConn = conn;
      // Pass the current request to the next middleware
      next();
    }
  });
}

export function close(req, res, next){
  req._rdbConn.close();
  next();
}
