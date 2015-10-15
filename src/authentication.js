'use strict';

import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import config from './config';
import {events} from './events';
import password from './password';
import expressJwt from 'express-jwt';
import UsersCollection from './users';
import OrganizationsCollection from './organizations';

let key = config.get('jwt:secret');
let Users = new UsersCollection();
let Organizations = new OrganizationsCollection();

export var authenticate = expressJwt({
  secret: key,
}).unless({
  path: '/authenticate',
});

export function login(req, res, next) {
  Users.getByEmail(req.body.email.toLowerCase())
    .run(req._rdbConn, function(err, results) {
      if (err) {
        next({status: 401, message: 'Wrong user or password'});
        return;
      }

      if (results.length <= 0) {
        next({status: 401, message: 'Wrong user or password'});
        return;
      }

      var profile = results[0];

      password.compare(req.body.password, profile.password, function(err, ok) {
        if (err) {
          err.status = 401;
          next(err);
          return;
        }
        if (!ok) {
          next({status: 401, message: 'Wrong user or password'});
          return;
        }

        // We are sending the profile inside the token
        var token = jwt.sign(profile, key, { expiresIn: 60 * 60 * 5 });

        res.json({ token: token });
        events.emit('user::login', {
          id: profile.id,
          organizationId: profile.organizationId,
        });
      });
    });
}

export function isAuthorized(permission) {
  return function(req, res, next) {
    if (!req.user[permission]) {
      return next({
        status: 401,
        message: 'you do not have permission to perform this action.',
      });
    }

    return next();
  };
}
