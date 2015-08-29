var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('*', function(req, res) {
  // Load our public/index.html file
  res.sendFile(path.resolve(__dirname, '../../public/index.html'));
});

module.exports = router;
