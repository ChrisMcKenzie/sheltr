var express = require('express');
var router = express.Router();
var Applicants = new (require('../applicants'))();

/* GET applicants listing. */
router.get('/', function(req, res) {
  Applicants.getAll().run(req._rdbConn, function(err, result){
    if(err) return res.status(500);

    res.send(result);
  });
});

module.exports = router;
