import express from 'express';
import {events} from '../../events';
import UsersCollection from '../../users';
import password from '../../password';
import {isAuthorized} from '../../authentication';
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
    events.emit('users::create', result);
  });
}

/* GET applicants listing. */
router.get('/', isAuthorized('admin'), (req, res, next) => {
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

router.delete('/:id', isAuthorized('admin'), (req, res, next) => {
  Users.delete(req.params.id)
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.post('/', isAuthorized('admin'), (req, res, next) => {
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
