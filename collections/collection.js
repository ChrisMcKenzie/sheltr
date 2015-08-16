/**
 * @module collections/collection
 */
import r from 'rethinkdb'
import debug from 'debug'

let logdebug = debug('app:collection:debug');
let logerror = debug('app:collection:error');

/**
 *  Run Handlers
 *
 *  Handles results returned by rethink
 *
 *  @private
 */
let _handler = function(hollaback){
  return function(err, cursor){
    if(err){
      return hollaback(err);
    } else {
      if ('function' === typeof cursor.toArray) {
        cursor.toArray(function(err, results){
          console.log(err, results)
          if(err) return hollaback(err);
          hollaback(null, results);
        });
      } else {
        hollaback(null, cursor);
      }
    }
  };
};

/**
 * Collection
 *
 *  A base class for querying data in rethinkdb
 *
 * @class
 */
export default class Collection {
  /**
   * @constructor
   * @param {string} table - The table that this collection
   * should use.
   */
  constructor(table){
    this._table = table;
    this._r = r;
    this.q = r.table(table);
  }
  /**
   * Base query builder
   *
   * this is meant to be used to construct more complex queries
   * on a table
   *
   * @return { Object }
   */
  query(...mixins){
    var query = this.q;
    mixins.forEach(function(mixin){
      if('function' === typeof mixin){
        query = mixin(query);
      } else {
        logerror('[WARN ] mixin must be function');
      }
    });

    return {
      run: function(conn, hollaback){
        return query.run(conn, _handler(hollaback));
      }
    }
  }
  /**
   *  Get Record by Id
   *
   *  builds a `r.table(<table-name>).get(<id>)` query
   *
   *  @param { string } id - Id of the record to get
   *  @return { Object }
   */
  getById(id){
    return this.query(function(q){
      return q.get(id)
    });
  }
}
