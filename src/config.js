'use strict';
import nconf from 'nconf';

nconf
  .argv()
  .env({
    separator: '_',
    lowerCase: true,
  });

nconf.defaults({
  env: process.env.NODE_ENV || 'development',
  jwt: {
    secretPath: process.env.HOME + '/.ssh/id_rsa.pub',
  },
  db: {
    host: 'localhost',
    port: 28015,
    name: 'sheltr',
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
});


export default nconf;
