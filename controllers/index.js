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
    return("Done")
}

async function getAllSensor(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getPresenceSensor(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getIntensitySensor(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getPushSensor(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getTouchSensor(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getLedValues(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getHpIsPlaying(req,res){
    var url = ""
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function modifyColor(req,res){
    var url = ""
    var intensity = req.body.intensity
    var rgb = req.body.rgb
    // var result = await request.post({
    //     'url': url, 
    //     'headers': headers,
    //     body : {
    //         'intensity':intensity,
    //         'rgb':rgb
    //     }
    // });
    saveBDD("LED",[{name: "intensity", value: String(intensity)},{name: "rgb", value: String(rgb)}])
    res.json("result")
}


async function playHP(req,res){
    var url = ""
    var state = req.body.state
    var volume = req.body.volume
    // var result = await request.post({
    //     'url': url, 
    //     body : {
    //         'state':state,
    //         'volume':volume
    //     }
    // });
    saveBDD("hp",[{name: "state", value: String(state)},{name: "volume", value: String(volume)}])
    res.json("result")
}


async function saveBDD(deviceName,newValue, sourceName){
    const newDevice = models.Device({
        device : deviceName,
        variable : newValue,
        date : new Date,
        source : sourceName
    });
    try{
        await newDevice.save()
    }catch(e){
        console.error(e.error);
    }
}

module.exports.sendSoundFile = sendSoundFile;  
module.exports.modifyColor = modifyColor;  
module.exports.getHpIsPlaying = getHpIsPlaying;  
module.exports.getLedValues = getLedValues;  
module.exports.getTouchSensor = getTouchSensor;  
module.exports.getPushSensor = getPushSensor;  
module.exports.getIntensitySensor = getIntensitySensor;  
module.exports.getPresenceSensor = getPresenceSensor;  
module.exports.getAllSensor = getAllSensor;
module.exports.playHP = playHP;   