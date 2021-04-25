
const mongoose=require('mongoose');
const academicStaffSchema = require('./academicStaffSchema.js').schema;
const slotSchema = require('./slotSchema.js').schema ;
const Schema = mongoose.Schema;
const courseSchema= new Schema({
    courseCode:{
        type:String,
        required:true,
        lowercase : true

    },
    instructors:[academicStaffSchema],
    teachingAssistants: [academicStaffSchema ],
    slots:[slotSchema],
    slotCoverage:{
        type:Number,
        default:0
       
    },
    courseCoordinatorId: {
        type:String,
        default : null,
        lowercase : true
    }
});
module.exports.schema =courseSchema ;
module.exports.model = mongoose.model('course',courseSchema);