var express = require('express');
var Input= require('../database/inputlowker');
var Anggota = require('../database/anggota');
var moment = require('moment');
var passport = require('passport');
var User = require('../database/userpemberilowker')


//var Auth_mdw= require('../middleware/authpencarikerja');

var Auth_mdw= require('../middleware/authpemberikerja');
var router = express.Router();

var session_store;


//untuk index

router.param('id' , function (req ,res ,next, id){
  var user = User.findById({ _id:id });
  if (user){
    req.user = user;
  }
  else{
    next(new Error('user not found'));
  }
  next();
});

router.get('/', Auth_mdw.check_login,function(req, res, next){ //urang Auth_mdw
  session_store= req.session_store;
  res.render('pemberikerja/index',{ session_store:session_store})
});

router.post('/', Auth_mdw.check_login,function(req, res, next) {
  res.redirect('/pemberikerja/index');
});

router.get('/index/:id([0-9]{3,8})', Auth_mdw.check_login,function(req, res, next) {
  var user = req.user;
  res.render('pemberikerja/index');


});

router.post('/index', Auth_mdw.check_login,function(req, res, next) {

  res.render('pemberikerja/index');
});



router.get('/addlowker/', Auth_mdw.check_login, function(req, res, next) {
  session_store = req.session;

    res.render('pemberikerja/addlowker',{session_store:session_store });

});

//tambah lowker input lowker//

///editlowker/(:id)
router.post('/addlowker/',  Auth_mdw.check_login, function (req, res, next){ //hapus Auth_mdw.check_login, Auth_mdw.is_admin,
//router.get('/editlowker/(:id)', function(req, res, next){ // Auth_mdw.check_login, Auth_mdw.is_admin//


    session_store = req.session;

    req.assert('NamaPekerjaan', 'Nama NamaPekerjaan').notEmpty();
    req.assert('JenisPekerjaan', 'JenisPekerjaan diperlukan').notEmpty();
    req.assert('Kemampuan', 'Kemampuan').notEmpty();
    req.assert('LokasiPekerjaan', 'Alamat Lengkap').notEmpty();
    req.assert('NamaPemberiPekerjaan', 'NamaPemberiPekerjaan').notEmpty();
    req.assert('Email', 'email tidak benar').isEmail().withMessage('E-mail tidak valid').notEmpty();
    req.assert('TanggalInput', 'Tanggal sekarang ').notEmpty();
    req.assert('Tag', 'Tag Pekerjaan').notEmpty();
    req.assert('Gaji', 'Gaji Pekerjaan').notEmpty();
    req.assert('DeskrepsiPekerjaan', 'DeskrepsiPekerjaan').notEmpty();


    var errors = req.validationErrors();
    console.log(errors);

    if (!errors)
    {
        i_NamaPekerjaan = req.sanitize( 'NamaPekerjaan' ).escape().trim();
        i_JenisPekerjaan = req.sanitize( 'JenisPekerjaan' ).escape().trim();
        i_Kemampuan = req.sanitize( 'Kemampuan' ).escape().trim();
        i_LokasiPekerjaan = req.sanitize( 'LokasiPekerjaan' ).escape().trim();
        i_NamaPemberiPekerjaan = req.sanitize( 'NamaPemberiPekerjaan' ).escape().trim();
        i_Email = req.sanitize( 'Email' ).escape().trim();
        i_TanggalInput = req.sanitize( 'TanggalInput' ).escape().trim();
        i_Tag = req.sanitize( 'Tag' ).escape().trim();
        i_Gaji = req.sanitize( 'Gaji' ).escape().trim();
        i_DeskrepsiPekerjaan = req.sanitize( 'DeskrepsiPekerjaan' ).escape().trim();

        User.find({ 'inputlowker.NamaPekerjaan': req.param('NamaPekerjaan') }, function (err, row){
            if (row.length == 0)
            {
                var jabatan = new User({
                    'NamaPekerjaan':i_NamaPekerjaan,
                    'JenisPekerjaan':i_JenisPekerjaan,
                    'Kemampuan':i_Kemampuan,
                    'LokasiPekerjaan':i_LokasiPekerjaan,
                    'NamaPemberiPekerjaan':i_NamaPemberiPekerjaan,
                    'Email':i_Email,
                    'TanggalInput':i_TanggalInput,
                    'Tag':i_Tag,
                    'Gaji':i_Gaji,
                    'DeskrepsiPekerjaan':i_DeskrepsiPekerjaan,

                });

                jabatan.save(function(err) {
                    if (err)
                    {
                        console.log(err);

                        req.flash('msg_error', 'Maaf, sepertinya ada masalah dengan sistem / Programkami...');
                        res.redirect('/pemberikerja/addlowker');
                    }
                    else
                    {
                        req.flash('msg_info', 'Jabatan berhasil dibuat...');
                        res.redirect('/pemberikerja');
                    }
                });
            }
            else
            {
                req.flash('msg_error', 'Maaf lowongan kerja sudah ada');
                res.render('pemberikerja/addlowker', {
                    session_store:session_store,
                    NamaPekerjaan: req.param('NamaPekerjaan'),
                    JenisPekerjaan: req.param('JenisPekerjaan'),
                    Kemampuan: req.param('Kemampuan'),
                    LokasiPekerjaan: req.param('LokasiPekerjaan'),
                    NamaPemberiPekerjaan: req.param('NamaPemberiPekerjaan'),
                    Email: req.param('Email'),
                    TanggalInput: req.param('TanggalInput'),
                    Tag: req.param('Tag'),
                    Gaji: req.param('Gaji'),
                    DeskrepsiPekerjaan:req.param('DeskrepsiPekerjaan'),
                });
            }
        });
    }
    else
    {
        // menampilkan pesan error
        errors_detail = "<p>Punten, sepertinya ada salah pengisian, mangga check lagi formnyah!</p><ul>";

        for (i in errors)
        {
            error = errors[i];
            errors_detail += '<li>'+error.msg+'</li>';
        }

        errors_detail += "</ul>";

        req.flash('msg_error', errors_detail);
        res.render('pemberikerja/addlowker', {
            session_store: session_store,
            NamaPekerjaan: req.param('NamaPekerjaan'),
            JenisPekerjaan: req.param('JenisPekerjaan'),
            Kemampuan: req.param('Kemampuan'),
            LokasiPekerjaan: req.param('LokasiPekerjaan'),
            NamaPemberiPekerjaan: req.param('NamaPemberiPekerjaan'),
            Email: req.param('Email'),
            TanggalInput: req.param('TanggalInput'),
            Tag: req.param('Tag'),
            Gaji: req.param('Gaji'),
            DeskrepsiPekerjaan:req.param('DeskrepsiPekerjaan'),
        });
    }
});

//ahir tambah lowker input lowker//
//ahir login pencarikerja



//tampil data lowker
/*
router.get('/', function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  User.find({}, function (err, rows){
    console.log(rows);
    res.render('pemberikerja/index',{ session_store:session_store,pemberikerja: rows})
  });

});
*/
/*
router.post('/', function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  User.find({}, function (err, rows){
    console.log(rows);
    res.render('pemberikerja/index',{ session_store:session_store,pemberikerja: rows})
  });

});
*/
router.get('/index', function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  User.find({}, function (err, rows){
    console.log(rows);
    res.render('pemberikerja/index',{ session_store:session_store,pemberikerja: rows})
  });

});
router.get('/datainputlowker/', Auth_mdw.check_login,function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  User.find({}, function (err, rows){
    console.log(rows);
    res.render('pemberikerja/datainputlowker',{ session_store:session_store,pemberikerja: rows})
  });

});

router.get('/data/', Auth_mdw.check_login,function(req , res ,next,namauser){ //urang Auth_mdw
  session_store= req.session_store;
  //  User.find({ 'user.namauser': req.param('namauser'),   }, function(err, masuk) {
  User.find({'user.namauser':'req.params.namauser'} , function (err, rows){


    console.log(rows);
    res.render('pemberikerja/data',{ session_store:session_store,pemberikerja: rows})
  });

});
/*
dsd

*/
//ahir tampil data lowker

//tampil profile
/*
router.get('/profile', function(req , res ,next){ //urang Auth_mdw
  session_store= req.session_store;
  User.findById(req.params.id, function (err , row){
    console.log(rows);
    res.render('pemberikerja/profile',{ session_store:session_store,pemberikerja: rows})
  });

});
*/
//ahir tampil profile//

//edit lowker
router.get('/editlowker/(:id)', function(req, res, next){ // Auth_mdw.check_login, Auth_mdw.is_admin
    session_store = req.session;

    User.findOne({_id:req.params.id}, function (err, row){
        if (row)
        {
            console.log(row);

            res.render('pemberikerja/editlowker', { session_store:session_store, pemberikerja:  row});
        }
        else
        {
            req.flash('msg_error', 'Maaf, lowongan Kerja Tidak Di Temukan');
            res.redirect('/pemberikerja');
        }
    });
});

router.put('/editlowker/(:id)', function(req, res, next){
//router.put('/edit/(:id)',

  session_store= req.session;
  //req.assert= ('NamaPemberiPekerjaan','NamaPemberiPekerjaan').notEmpty();
  req.assert('NamaPekerjaan', 'Nama NamaPekerjaan').notEmpty();
  req.assert('JenisPekerjaan', 'JenisPekerjaan diperlukan').notEmpty();
  req.assert('Kemampuan', 'Kemampuan').notEmpty();
  req.assert('LokasiPekerjaan', 'Alamat Lengkap').notEmpty();
  req.assert('NamaPemberiPekerjaan', 'NamaPemberiPekerjaan').notEmpty();
  req.assert('Email', 'email tidak benar').isEmail().withMessage('E-mail tidak valid').notEmpty();
//  req.assert('TanggalInput', 'Tanggal sekarang ').notEmpty();
  req.assert('Tag', 'Tag Pekerjaan').notEmpty();
  req.assert('Gaji', 'Gaji Pekerjaan').notEmpty();
  req.assert('DeskrepsiPekerjaan', 'DeskrepsiPekerjaan').notEmpty();
  var errors = req.validationErrors();
  console.log(errors);

  if (!errors)
  {
    i_NamaPekerjaan = req.sanitize( 'NamaPekerjaan' ).escape().trim();
    i_JenisPekerjaan = req.sanitize( 'JenisPekerjaan' ).escape().trim();
    i_Kemampuan = req.sanitize( 'Kemampuan' ).escape().trim();
    i_LokasiPekerjaan = req.sanitize( 'LokasiPekerjaan' ).escape().trim();
    i_NamaPemberiPekerjaan = req.sanitize( 'NamaPemberiPekerjaan' ).escape().trim();
    i_Email = req.sanitize( 'Email' ).escape().trim();
  //  i_TanggalInput = req.sanitize( 'TanggalInput' ).escape().trim();
    i_Tag = req.sanitize( 'Tag' ).escape().trim();
    i_Gaji = req.sanitize('Gaji').escape().trim();
    i_DeskrepsiPekerjaan = req.sanitize('DeskrepsiPekerjaan').escape().trim();

    User.findById(req.params.id, function (err , row){
      row.inputlowker.NamaPekerjaan=i_NamaPekerjaan;
      row.inputlowker.JenisPekerjaan=i_JenisPekerjaan;
      row.inputlowker.Kemampuan=i_Kemampuan;
      row.inputlowker.LokasiPekerjaan=i_LokasiPekerjaan;
      row.inputlowker.NamaPemberiPekerjaan=i_NamaPekerjaan;
      row.inputlowker.Email=i_Email;
  //    row.TanggalInput=i_TanggalInput;
      row.inputlowker.tag=i_Tag;
      row.inputlowker.Gaji=i_Gaji;
      row.DeskrepsiPekerjaan=i_DeskrepsiPekerjaan;

      row.save(function(err){
          if (err)
          {
            console.log(err);
            req.flash('msg_error','Ada kesalahan sistem');
            res.redirect('/pemberikerja');
          }
          else {
            req.flash('msg_info','Berhasil Edit');
            res.redirect('/pemberikerja');
          }
      });

    });
  }
  else{
    errors_detail = " <p> Ada Kesalahan Pengisian , silahkan check lagi </p> <ul>";
    for (i in error)
    {
      error=errors[i];
      errors_detail+= '<li>'+error.msg+'</li>';
    }
    errors_detail += "</ul>";

    req.flash('msg_error', errors_detail);
    res.render('pemberikerja/editlowker', {
      _id:req.params.id,
      session_store: session_store,
      NamaPekerjaan: req.param('NamaPekerjaan'),
      JenisPekerjaan: req.param('JenisPekerjaan'),
      Kemampuan: req.param('Kemampuan'),
      LokasiPekerjaan: req.param('LokasiPekerjaan'),
      NamaPemberiPekerjaan: req.param('NamaPemberiPekerjaan'),
      Email: req.param('Email'),
  //    TanggalInput: req.param('TanggalInput'),
      Tag: req.param('Tag'),
      Gaji: req.param('Gaji'),
      DeskrepsiPekerjaan: req.param('DeskrepsiPekerjaan'),

    });
  }

});
//ahir edit lowker

//detele lowker
router.delete('/delete/(:id)', function(req , res ,next){
  User.findById(req.params.id , function(err , row){
    row.remove(function(err , low){
      if (err)
      {
        console.log(err);
        req.flash('msg_error','data yang di hapus tidak ada')
      }
      else {
        req.flash('msg_info','Berhasil Hapus')
      }
      res.redirect('/pemberikerja')
    });
  });
});
//ahir delete lowker

//edit user //

router.get('/edituser/(:id)',Auth_mdw.check_login, function(req, res, next){ // Auth_mdw.check_login, Auth_mdw.is_admin
    session_store = req.session;

    User.findOne({_id:req.params.id}, function (err, row){
        if (row)
        {
            console.log(row);

            res.render('pemberikerja/edituser', { session_store:session_store, pemberikerja:  row});
        }
        else
        {
            req.flash('msg_error', 'Maaf, profile Tidak Di Temukan');
            res.redirect('/pemberikerja');
        }
    });
});

router.put('/edituser/(:id)', function(req, res, next){
//router.put('/edit/(:id)',

  session_store= req.session;
  //req.assert= ('NamaPemberiPekerjaan','NamaPemberiPekerjaan').notEmpty();
  req.assert('lembaga', 'Nama lembaga').notEmpty();
  req.assert('alamat', 'alamat').notEmpty();
  req.assert('email', 'email').notEmpty();
  req.assert('notelepon', 'notelepon').notEmpty();
  req.assert('deskrepsi', 'deskrepsi').notEmpty();
  var errors = req.validationErrors();
  console.log(errors);

  if (!errors)
  {
    i_lembaga = req.sanitize( 'lembaga' ).escape().trim();
    i_alamat = req.sanitize( 'alamat' ).escape().trim();
    i_email = req.sanitize( 'email' ).escape().trim();
    i_notelepon = req.sanitize( 'notelepon' ).escape().trim();
    i_deskrepsi = req.sanitize( 'deskrepsi' ).escape().trim();


    User.findById(req.params.id, function (err , row){
      row.perusahaan.lembaga=i_lembaga;
      row.perusahaan.alamat=i_alamat;
      row.perusahaan.email=i_email;
      row.perusahaan.notelepon=i_notelepon;
      row.perusahaan.deskrepsi=i_deskrepsi;

      row.save(function(err){
          if (err)
          {
            console.log(err);
            req.flash('msg_error','Ada kesalahan sistem');
            res.redirect('/pemberikerja');
          }
          else {
            req.flash('msg_info','Berhasil Edit User');
            res.redirect('/pemberikerja');
          }
      });

    });
  }
  else{
    errors_detail = " <p> Ada Kesalahan Pengisian , silahkan check lagi </p> <ul>";
    for (i in error)
    {
      error=errors[i];
      errors_detail+= '<li>'+error.msg+'</li>';
    }
    errors_detail += "</ul>";

    req.flash('msg_error', errors_detail);
    res.render('pemberikerja/edituser', {
      _id:req.params.id,
      session_store: session_store,
      lembaga: req.param('lembaga'),
      alamat: req.param('alamat'),
      email: req.param('email'),
      notelepon: req.param('notelepon'),
      deskrepsi: req.param('deskrepsi'),

    });
  }

});
//ahir edit user //

// new user daftar pemberikerja kerja
/*
router.get('/login', function(req, res, next) {
  res.render('pemberikerja/login', { message: req.flash('loginMessage') });
});
*/
router.get('/signup', function(req, res) {
  res.render('pemberikerja/signup.ejs', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('pemberikerja/profile.ejs', { user: req.user });
});



router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/pemberikerja/index',
  failureRedirect: '/pemberikerja/signup',
  failureFlash: true,
}));
/*
router.post('/login', passport.authenticate('pemberikerja-login', {
  successRedirect: '/pemberikerja/addlowker',
  failureRedirect: '/pemberikerja/login',
  failureFlash: true,
}));
*/
router.get('/login', function(req, res,next) {
  res.render('pemberikerja/login');
});

router.post('/login', function(req, res, next) {
  session_store = req.session;
  /*
  var password = crypto.createHmac('sha256', secret)
                   .update(req.param('password'))
                   .digest('hex');
*/
  if (req.param('namauser') == ""  || req.param('password') == "")
  {
      req.flash('info', 'Form Harus Di isi');
      res.redirect('/pemberikerja/login');
  }
  else
  {

      User.find({ 'user.namauser': req.param('namauser'),   }, function(err, masuk) {
      if (err) throw err;

      if (masuk.length > 0)
      {
          session_store.namauser = masuk[0].namauser;
          session_store.password = masuk[0].password;
          session_store.logged_in = true;

          res.redirect('/pemberikerja');
      }
      else
      {
          req.flash('info', 'Sepertinya akun Anda salah!');
          res.redirect('/pemberikerja/login');
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
      res.redirect('/pemberikerja');
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}

module.exports = router;
