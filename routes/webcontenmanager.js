var express = require('express');
var crypto = require('crypto');
var User= require('../database/UserWebContenManager');
var pemberikerja= require('../database/userpemberilowker');
var Auth_mdw= require('../middleware/authwebcontenmanager');
//var Auth_mdw = require('../middlewares/auth');
var router = express.Router();
//var rahasia='terserah';
var secret = 'sukasuka';
var session_store;

/* GET users listing. */

/*
router.get('/index', function(req, res, next) {
  res.render('index');
});

*/
/*
router.get('/', function(req, res, next) {
  res.render('webcontenmanager/index');
});
*/
router.get('/', Auth_mdw.check_login,function(req, res, next){ //urang Auth_mdw
  session_store= req.session_store;
  User.find({'_id': req.param('id')});
  res.render('webcontenmanager/index',{ session_store:session_store})
});

router.post('/', Auth_mdw.check_login,function(req, res, next) {
  res.redirect('/webcontenmanager/index');
});

router.get('/index/(:id)',function(req, res, next) {
  User.find({'_id': req.param('id')});
  res.render('webcontenmanager/index');
});

router.post('/index/(:id)', Auth_mdw.check_login,function(req, res, next) {
  User.find({'_id': req.param('id')});
  res.render('webcontenmanager/index');
});

router.get('/login',function(req, res, next) {
  res.render('webcontenmanager/login');
});
router.post('/login', function(req, res, next) {
  session_store = req.session;
  var password = crypto.createHmac('sha256', secret)
                   .update(req.param('password'))
                   .digest('hex');

  if (req.param('NamaPengguna') == ""  || req.param('password') == "")
  {
      req.flash('info', 'Punten, tidak boleh ada field yang kosong!');
      res.redirect('/webcontenmanager/login');
  }
  else
  {
      //edit 10may , usernamejadi NamaPengguna atau sebalinya
      User.find({ username: req.param('NamaPengguna'), password:password }, function(err, user) {
      if (err) throw err;

      if (user.length > 0)
      {
          session_store.NamaPengguna = user[0].NamaPengguna;
          session_store.NamaDepan = user[0].NamaDepan;
          session_store.NamaBelakang = user[0].NamaBelakang;
          session_store.logged_in = true;

          res.redirect('/webcontenmanager');
      }
      else
      {
          req.flash('info', 'Sepertinya akun Anda salah!');
          res.redirect('/webcontenmanager/login');
      }

    });
  }
});

router.get('/logout', function(req, res){
    req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else
    {
      res.redirect('/webcontenmanager/login');
    }
  });
});
// tampil lowker







router.get('/datalowker',function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  pemberikerja.find({}, function (err, rows){
    console.log(rows);
    res.render('webcontenmanager/datalowker',{ session_store:session_store,pemberikerja: rows})
  });
});



//ahir tampil lowker
module.exports = router;
