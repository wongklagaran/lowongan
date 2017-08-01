var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ambillowker = new Schema({
    NamaPekerjaan:String,
    JenisPekerjaan: {type: String, required: true,unique:true},
    Kemampuan:String,
    LokasiPekerjaan:String,
    NamaPemberiPekerjaan: String,
    Gaji: String,
    Email: String,
    DeskrepsiPekerjaan:String,
    TanggalInput: Date,


    UserPencariKerja: String,
    NamaDepan: String,
    NamaBelakang: String,
    //Tag: [{Tag: String, types: String}],

},
{
    timestamps: true
});

var ambillowker = mongoose.model('ambillowker', ambillowker);

module.exports = ambillowker;
