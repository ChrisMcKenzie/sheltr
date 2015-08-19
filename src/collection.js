/**
 * @module collections/collection
 */
import r from 'rethinkdb'
import debug from 'debug'

/**
 *  Run Handlers
 *
 *  Handles results returned by rethink
 *
 *  @private
 */
let _handler = function(hollaback){
  return function(err, cursor){
    if(err) return hollaback(err);

    if ('function' === typeof cursor.toArray) {
      cursor.toArray(function(err, results){
        if(err) return hollaback(err);
        hollaback(null, results);
      });
    } else {
      hollaback(null, cursor);
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
    this.log = {
      error: debug('sheltr:collection:' + table + ':error'),
      debug: debug('sheltr:collection:' + table + ':debug')
    }
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
        this.log.error('[ERROR ] mixin must be function');
      }
    });

    return {
      run: function(conn, hollaback){
        return query.run(conn, _handler(hollaback));
      }
    }
  }
  // alias to query
  getAll() {
    return this.query.apply(this, arguments);
  }
  /**
   *  Get Record by Id
   *
   *  builds a `r.table(<table-name>).get(<id>)` query
   *
   *  @param { string } id - Id of the record to get
   *  @return { Object }
   */
  getById(id) {
    return this.query(function(q){
      return q.get(id)
    });
  }

  /**
   *  Insert the given record
   *
   *  builds a `r.table(<table-name>).insert(<data>)` query
   *
   *  @param { Object } data - The data to be inserted
   *  @return { Object }
   */
  insert(data) {
    // TODO(ChrisMcKenzie): validate based on json schema
    // if it has been set.

    return this.query(function(q){
      return q.insert(data);
    });
  }
}
