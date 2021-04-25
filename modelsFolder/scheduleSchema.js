const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slotSchema = require('./slotSchema').schema;

const scheduleSchema = new Schema({
    saturday :[slotSchema],
    sunday :[slotSchema],
    monday :[slotSchema],
    tuesday :[slotSchema],
    wednesday :[slotSchema],
    thursday :[slotSchema],
    friday   :[slotSchema]
});
module.exports.schema=scheduleSchema;
module.exports.model = mongoose.model('schedule',scheduleSchema);
