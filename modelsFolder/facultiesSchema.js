const mongoose=require('mongoose');
const departmentSchema = require('./departmentSchema.js').schema;
const Schema = mongoose.Schema;


const facultiesSchema= new Schema({

    name:{
        type : String,
        required : true,
        lowercase : true
        
    },
   departments:[departmentSchema]
        
    

})


module.exports.model = mongoose.model('faculties',facultiesSchema); 
