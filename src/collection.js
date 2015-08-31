/**
 * @module collections/collection
 */
import r from 'rethinkdb';
import debug from 'debug';

/**
 *  Run Handlers
 *
 *  Handles results returned by rethink
 *
 *  @private
 */
let _handler = function(hollaback) {
  return function(err, cursor) {
    if (err) return hollaback(err);

    if ('function' === typeof cursor.toArray) {
      cursor.toArray(function(err, results) {
        if (err) return hollaback(err);
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
  constructor(table) {
    this._table = table;
    this._r = r;
    this.q = r.table(table);
    this.log = {
      error: debug('sheltr:collection:' + table + ':error'),
      debug: debug('sheltr:collection:' + table + ':debug'),
    };
  }
  /**
   * Base query builder
   *
   * this is meant to be used to construct more complex queries
   * on a table
   *
   * @return { Object }
   */
  query(...decorators) {
    var query = this.q;
    decorators.forEach(function(mixin) {
      if ('function' === typeof mixin) {
        query = mixin(query);
      } else {
        this.log.error('[ERROR ] mixin must be function');
      }
    });

    return {
      run: function(conn, hollaback) {
        return query.run(conn, _handler(hollaback));
      },
    };
  }

  filter(params) {
    return this.query(function(q) {
      var notFilters = ['limit', 'page', 'group'];

      var limit = parseInt(params.limit);
      var page = params.page - 1 || 0;

      for (var key in params) {
        if (notFilters.indexOf(key) === -1) {
          var filter = {};
          filter[key] = params[key];
          q = q.filter(filter);
        }
      }

      // Handle limit
      if (!isNaN(limit) && !isNaN(page)) {
        q = q.skip(page * limit).limit(limit);
      }

      return q;
    });
  }

  // Alias to query
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
    return this.query(function(q) {
      return q.get(id);
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

    // Added created and updated fields
    data.created = r.now();
    data.updated = r.now();

    return this.query(function(q) {
      return q.insert(data);
    });
  }
}
