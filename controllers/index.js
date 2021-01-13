const request = require("request-promise");
const models = require("../schemas");
let fs = require('fs');
var host = "192.168.1.15:80";
headers= {
    "Content-Type": "application/json",
  }

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
    var url = host+"/getPresenceSensor"
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    res.json(result)
}

async function getIntensitySensor(req,res){
    var url = host+"/getIntensitySensor"
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
    var url = host+"/getLedValues"
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
    var url = host+"/modifyColor"
    var state = req.body.state
    var intensity = req.body.intensity
    var r = req.body.r
    var g= req.body.g
    var b = req.body.b
    var source = req.body.source
    var result = await request.post({
        'url': url, 
        'headers': headers,
        body : {
            'intensity':intensity,
            'R':r,
            'G':g,
            'B':b,
            'led_mod':mode

        }
    });
    saveBDD(req.body.id,{date: new Date(), source:source, variables:[{name: "state", value: String(state)},{name: "intensity", value: String(intensity)},{name: "rgb", value: String(rgb)}]})
    res.json(result)
}


async function playHP(req,res){
    var url = ""
    var state = req.body.state
    var volume = req.body.volume
    var source = req.body.source
    // var result = await request.post({
    //     'url': url, 
    //     body : {
    //         'state':state,
    //         'volume':volume
    //     }
    // });
    saveBDD( req.body.id,{date: new Date(), source:source, variables: [{name: "state", value: String(state)},{name: "volume", value: String(volume)}]})
    res.json("result")
}


async function saveBDD(id,newValue){
    try{
        await models.Device.updateOne(
        { _id: id }, 
        { $push: { stateList: [newValue] }});
      }catch(e){
        console.error(e)
    }
}

async function getAllDevice(req,res){
    var devices;
    try{
        devices = await models.Device.find()
    }catch(e){
        console.error(e);
        res.status(500).send("error requesting database");

    }finally{
        res.json(devices)
    }
}

async function getOneDevice(req,res){
    var deviceHist;
    try{
        deviceHist = await models.Device.findOne({ _id: req.params.id })
    }catch(e){
        console.error(e);
        res.status(500).send("error requesting database");

    }finally{
        res.json(deviceHist)
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
module.exports.getAllDevice = getAllDevice;
module.exports.getOneDevice = getOneDevice;   