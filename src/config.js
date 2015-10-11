'use strict';

export default {
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secretPath: process.env.JWT_PUB_KEY ||
      process.env.HOME + '/.ssh/id_rsa.pub',
  },
  db: {
    host: process.env.RETHINKDB_PORT_28015_TCP_ADDR || 'localhost',
    port: parseInt(process.env.RETHINKDB_PORT_28015_TCP_PORT) || 28015,
    name: process.env.RDB_DB || 'sheltr',
    tables: {
      applicants: {
        primary: 'id',
        secondary: {
          organizationId: 'organizationId',
          createdBy: 'createdBy',
        },
      },
      users: {
        primary: 'id',
        secondary: {
          organizationId: 'organizationId',
          email: 'email',
        },
      },
      organizations: {
        primary: 'id',
      },
    },
  },
};
