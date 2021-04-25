const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceSchema = new Schema({
    Id:{
        type: String,
        required: true,
        lowercase : true 
     }
});
const attendance = mongoose.model('attendance',attendanceSchema);
module.exports.model = attendance;