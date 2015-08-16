'use strict';

export default {
  env: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.RDB_HOST || 'localhost',
    port: parseInt(process.env.RDB_PORT) || 28015,
    name: process.env.RDB_DB || 'sheltr',
    tables: {
      'people': {
        primary: 'id'
      },
      'users': {
        primary: 'id'
      }
    }
  }
};
