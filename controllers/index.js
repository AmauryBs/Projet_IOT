const request = require("request-promise");
const models = require("../schemas");
let fs = require('fs');

async function sendSoundFile(req,res){
    var url = ""
    var options = {
        file: fs.createReadStream(__dirname + "/inputFile/sound.txt")
    }
    var result = await request.post({'url': url, 'headers': headers, formData :options}, function(err, httpResponse, body){
        console.log(err);
        console.log(httpResponse);
    });
}

async function getAllSensor(req,res){
    var url = ""
    console.log("ouais")
    // var result = await request.post({'url': url, 'headers': headers, formData :options}, function(err, httpResponse, body){
    //     console.log(err);
    //     console.log(httpResponse);
    // });
    res.json('captor value')
}


module.exports.sendSoundFile = sendSoundFile;  
module.exports.getAllSensor = getAllSensor;  