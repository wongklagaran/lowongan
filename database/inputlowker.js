var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var inputlowker = new Schema({
  perusahaan: { type: Schema.ObjectId, ref: 'userpemberilowker', required: true }, //reference to the associated book
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

var inputlowker = mongoose.model('inputlowker', inputlowker);

module.exports = inputlowker;
