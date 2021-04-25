const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const roomSchema = new Schema({
    name:{
        type: String,
        required: true,
        lowercase : true
     },
     capacity:{
        type: Number,
        required: true 
     },
    type:{
       type: String,
       lowercase : true,
       required: true 
    }
});
module.exports.model = mongoose.model('room',roomSchema);
