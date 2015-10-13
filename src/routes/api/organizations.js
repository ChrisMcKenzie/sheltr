import express from 'express';
import OrganizationsCollection from '../../organizations';

let router = express.Router();
let Organizations = new OrganizationsCollection();

router.get('/', (req, res, next) => {
  Organizations.getById(req.user.organizationId)
  .run(req._rdbConn, (err, result) => {
    if (err) return next(err);

    res.status(200).send(result);
  });
});

export default router;
