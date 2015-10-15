import express from 'express';
import OrganizationsCollection from '../../organizations';

let router = express.Router();
let Organizations = new OrganizationsCollection();

export function getForUser(req, res, next) {
  Organizations.getById(req.user.organizationId)
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
}

router.get('/', (req, res, next) => {
  Organizations.filter(req.query)
  .run(req._rdbConn, (err, results) => {
    if (err) return next(err);

    res.status(200).send(results);
  });
});

export var Admin = router;
