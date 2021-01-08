var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DeviceSchema = new Schema({
    _id : String,
    name : String,
    type : String,
    stateList : [{
        date: Date,
        source : String,
        variables:[{
            name: String,
            value: String,
        }]
    }],
},{ _id: false });


var Device = mongoose.model('Device', DeviceSchema)

module.exports = {
Device : Device
}
