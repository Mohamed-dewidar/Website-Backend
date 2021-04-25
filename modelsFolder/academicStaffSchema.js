const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const scheduleSchema  = require('./scheduleSchema').schema;
const academicStaffSchema= new Schema({
    id:{
        type: String,
        required: true,
        lowercase : true
     },
     annualLeaveBalance:{
      type:Number
     },
     email:{
        type: String,
        required: true ,
        lowercase : true
     },
    firstName:{
       type: String,
       required: true,
       lowercase : true 
    },
     lastName:{
        type: String,
        required: true ,
        lowercase : true
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
        required: true,
        lowercase : true
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
      default : null
   },
   gender:{
      type:String,
      enum: ['female', 'male'],
      required: true
   },
   department:{
      type:String,
      lowercase:true
   },
   workingMap:{
      type:Map,
      of:Number,
      
   },
   missingDays:{
      type:Number
   },
   faculty:{
      type:String,
      lowercase:true
   },
   lastLogin:{
      type:Date
   },
   lastLogout:{
      type:Date
   },
   schedule: scheduleSchema
});
module.exports.schema=academicStaffSchema;
module.exports.model = mongoose.model('academicStaff',academicStaffSchema);