import express from 'express';
import ApplicantsCollection from '../../applicants';

let router = express.Router();
let Applicants = new ApplicantsCollection();

/* GET applicants listing. */
router.get('/', (req, res, next) => {
  Applicants.getAll().run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.get('/:id', (req, res, next) => {
  Applicants.getById(req.params.id).run((err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

router.post('/', (req, res, next) => {
  Applicants.insert(req.body).run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(201).send(req.body);
  });
});

export default router;
