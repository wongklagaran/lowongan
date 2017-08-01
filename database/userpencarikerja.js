var  mongoose= require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userschema = mongoose.Schema({

    username : {type:String, index:true},
    password : String,
    nama: String,
    alamat: String,
    tanggal_lahir: Date,
    notelepon : String,
    email : String,
  },
  {
      timestamps: true

  });

var userpencarikerja = mongoose.model('userpencarikerja', userschema);

module.exports.createUser = function(NewUser, callback){
  bcrypt.genSalt(10 ,function (err, salt){
    bcrypt.hash(NewUser.password, salt, function(err , hash){
        NewUser.password = hash;
        NewUser.save(callback);
    });
  });
}
