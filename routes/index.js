var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express' });
});
router.get('/nav', function(req, res, next) {
  res.render('nav.ejs', { title: 'Express' });
});
module.exports = router;
