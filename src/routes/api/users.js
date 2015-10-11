import express from 'express';
import UsersCollection from '../../users';
import password from '../../password';
import {OrgListFilter, OrgSingleFilter} from './filters';

let router = express.Router();
let Users = new UsersCollection();

function createUser(req, res) {
  req.body.organizationId = req.user.organizationId;

  Users.insert(req.body).run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    result = result.changes[0].new_val;
    // jscs:enable
    delete result.password;

    res.status(201).send(result);
  });
}

/* GET applicants listing. */
router.get('/', (req, res, next) => {
  Users.filter(req.query, OrgListFilter(req.user.organizationId))
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.get('/me', (req, res, next) => {
  Users.getById(req.user.id, OrgSingleFilter(req.user.organizationId))
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.get('/:id', (req, res, next) => {
  Users.getById(req.params.id, OrgSingleFilter(req.user.organizationId))
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.post('/', (req, res, next) => {
  if (!req.body.password || !req.body.email) {
    return next(new Error('email and password are required'));
  }

  password.hash(req.body.password)
  .then(function(password) {
    req.body.password = password;
    createUser(req, res);
  })
  .catch(function(err) {
    next(err);
  });
});


export default router;
