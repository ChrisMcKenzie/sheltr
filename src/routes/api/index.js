'use strict';

import jwt from 'jsonwebtoken';
import users from './users';
import * as db from '../../db';
import express from 'express';
import applicants from './applicants';
import org from './organizations';
import bodyParser from 'body-parser';
import * as auth from '../../authentication';

let router = express.Router();

router.use(db.open);
router.use(bodyParser.json());

router.post('/authenticate', auth.login);
router.use(auth.authenticate);

router.use('/applicants', applicants);
router.use('/users', users);
router.use('/organization', org);

module.exports = router;
