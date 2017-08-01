var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  user: {
    namauser: String,
    password: String,
  },
  perusahaan : {lembaga:String,alamat:String,email:String,notelepon:String,deskrepsi:String,},
  inputlowker :{
    NamaPekerjaan:String,JenisPekerjaan: String,
    Kemampuan:String, LokasiPekerjaan:String,
    NamaPemberiPekerjaan: String,Gaji: String,Email: String,
    DeskrepsiPekerjaan:String,
    TanggalInput:{ type: Date, default: Date.now },
    Tag: String,
  },
},
{
    timestamps: true

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.user.password);
};
module.exports = mongoose.model('userpemberilowker', userSchema);
