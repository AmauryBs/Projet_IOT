var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DeviceSchema = new Schema({
    device : String,
    variable : [{
        name: String,
        value: String
    }],
    date : Date,
    source : String
});


var Device = mongoose.model('Device', DeviceSchema)

module.exports = {
Device : Device
}
