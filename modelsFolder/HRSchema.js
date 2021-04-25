const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HRSchema = new Schema({
    id:{
        type: String,
        lowercase : true,
        required: true 
     },
     email:{
        type: String,
        lowercase : true,
        required: true 
     },
    firstName:{
       type: String,
       lowercase : true,
       required: true 
    },
     lastName:{
        type: String,
        lowercase : true,
        required: true 
     },
     password:{
        type: String,
        required: true 
     },
     salary:{
        type: Number,
        required: true 
     },
     role:{
        type: String,
        lowercase : true,
        required: true
     },
     office:{
      type:String,
      lowercase :true,
      default : null
   },
   new:{
      type : Boolean,
      default: true
   },
   dayOff : {
      type : Number,
      lowercase : true,
      default : 0
   },
   gender:{
      type:String,
      lowercase:true,
      required: true
   }
});

module.exports.model = mongoose.model('HRMembers',HRSchema);