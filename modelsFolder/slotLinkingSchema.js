const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slotLinkingSchema= new Schema({
    amID:{
        type:String,
        lowercase:true,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    slotNumber:{
        type:Number,
        required:true
    },
    room:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum: ['PENDING', 'CLOSED','REJECTED'],
        default: 'PENDING'
    }
});
module.exports.schema= slotLinkingSchema;
module.exports.model = mongoose.model('slotLinking',slotLinkingSchema);