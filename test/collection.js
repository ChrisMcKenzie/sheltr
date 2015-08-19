import assert from 'assert';
import Collection from '../collections/collection.js'
var db = require('../db')

let _dbConn;
let _collection;

describe('Collection', function() {

  before(function(done){
    db.setup(() => {
      _collection = new Collection('users');
    });

  });

  describe('#query(...mixin)', function () {
    it('it should build a query that returns rethinkdb info', function (done) {
      db.connect((err, conn) => {
        _collection.query(function(q){
          return q.info();
        }).run(_dbConn, function(err, result){
          assert.ifError(err);
          done();
        });
      });
    });
  });
});
