var mongoose = require('mongoose');
const Schema = mongoose.Schema;



const DeviceSchema = new Schema({
    _id : String,
    name : String,
    type : String,
    img: String,
    stateList : [{
        date: mongoose.Number,
        source : String,
        variables:[{
            name: String,
            value: String,
        }]
    }],
},{ _id: false });

const UserSchema = new Schema({
    //_id : String,
    nom : String,
    prenom : String,
    age : mongoose.Number,
    sexe : String,
    email : String,
    password : String,
    adresse : String,
    ville : String,
    pays : String,
    
});



var Device = mongoose.model('Device', DeviceSchema)
var User = mongoose.model('User', UserSchema)

module.exports = {
Device : Device,
User :User
}
