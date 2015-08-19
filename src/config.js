'use strict';

export default {
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.RETHINKDB_PORT_28015_TCP_ADDR || 'localhost',
    port: parseInt(process.env.RETHINKDB_PORT_28015_TCP_PORT) || 28015,
    name: process.env.RDB_DB || 'sheltr',
    tables: {
      'applicants': {
        primary: 'id'
      },
      'users': {
        primary: 'id'
      }
    }
  }
};
