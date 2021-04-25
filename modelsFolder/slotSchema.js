const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slotSchema = new Schema({
      courseCode:{
         type: String,

      },
      date:{
        type: Date,
        required: true 
      },
     slotNumber:{
        type: Number,
        required: true 
     },
    isCovered:{
       type: Boolean,
       unique: false,
       default : false
    },
     room:{
        type: String,
        default : null ,
        lowercase : true
      },
     type :{
        type: String,
        lowercase : true,
        required: true 
     },
     teacherId:{
        type: String,
         default : null,
         lowercase : true
         }
         
});
module.exports.schema=slotSchema;
module.exports.model = mongoose.model('slot',slotSchema);
