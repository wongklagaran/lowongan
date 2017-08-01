var mongoose =require('mongoose');
var crypto= require('crypto');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/skripsi');

var User = require('../database/inputlowker');

User.find({UserPencariKerja:'User01'}, function (err,user){
//User.find({username:'superadmin'}, function (err, user){
  if (user.length == 0)
  {

    var inputlowker = new User({
        NamaPekerjaan:webdevelopers,
        JenisPekerjaan: progaming,
        Kemampuan:php ,html ,
        LokasiPekerjaan:bandung,
        NamaPemberiPekerjaan: pt web,
        Email: web@gmail.com,
        Tag: web,

      });

    inputlowker.save(function(err) {
      if (err) throw err;

       console.log('inputlowker berhasil di buat');
      });
    }
});
