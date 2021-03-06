import express from 'express';
import r from 'rethinkdb';
import {events} from '../../events';
import ApplicantsCollection from '../../applicants';
import {OrgListFilter, OrgSingleFilter} from './filters';

let router = express.Router();
let Applicants = new ApplicantsCollection();

/* GET applicants listing. */
router.get('/', (req, res, next) => {
  Applicants.filter(
    req.query,
    OrgListFilter(req.user.organizationId)
  )
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.get('/:id', (req, res, next) => {
  Applicants.getById(
    req.params.id,
    OrgSingleFilter(req.user.organizationId)
  )
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.post('/', (req, res, next) => {
  req.body.organizationId = req.user.organizationId;

  Applicants.insert(req.body).run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(201).send(req.body);
    events.emit('applicants::create', req.body);
  });
});

router.patch('/:id', (req, res, next) => {
  delete req.body.organizationId;

  Applicants.update(req.params.id, req.body)
    .run(req._rdbConn, (err, result) => {
      if (err) return next(err);

      res.status(200).send(req.body);
      events.emit('applicants::update', req.body);
    });
});

router.delete('/:id', (req, res, next) => {
  Applicants.update(req.params.id, {
    status: 'archived',
    deleted: r.now(),
    deletedBy: req.user.id,
  })
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(null);
  });
});

export default router;
