
const mongoose=require('mongoose');
const courseSchema = require('./courseSchema').schema;
const Schema = mongoose.Schema;
const departmentSchema= Schema({
    // name is the _id
    name:{
        type:String,
        required:true,
        lowercase : true
    },
    HODId:{
        type:String,
        required:true,
        lowercase : true
    },
    courses:[courseSchema]
});

module.exports.schema= departmentSchema;
module.exports.model = mongoose.model('department',departmentSchema);;