'use strict';

import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import users from './users';
import config from '../../config';
import express from 'express';
import password from '../../password';
import expressJwt from 'express-jwt';
import applicants from './applicants';
import bodyParser from 'body-parser';
import UsersCollection from '../../users';

let Users = new UsersCollection();
let router = express.Router();

var key = fs.readFileSync(path.normalize((config.jwt.secretPath)));

router.use(bodyParser.json());

router.post('/authenticate', (req, res, next) => {
  Users.getByUsername(req.body.username.toLowerCase())
    .run(req._rdbConn, function(err, results) {
      if (err) {
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
        var token = jwt.sign(profile, key, { expiresInMinutes: 60 * 5 });

        res.json({ token: token });
      });
    });
});

router.use(
  expressJwt({
    secret: key,
  }).unless({
    path: '/authenticate',
  })
);

router.use('/applicants', applicants);
router.use('/users', users);

module.exports = router;
