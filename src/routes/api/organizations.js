import express from 'express';
import OrganizationsCollection from '../../organizations';

let router = express.Router();
let Organizations = new OrganizationsCollection();


export default router;
