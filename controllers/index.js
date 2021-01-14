const request = require("request-promise");
const models = require("../schemas");
let fs = require('fs');
var host = "http://192.168.1.15:80";
headers= {
    "Content-Type": "application/json",
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

    console.log(req.body.source)
    //saveBDD( req.body.id,{date: new Date(), source:source, variables: [{name: "state", value: String(state)},{name: "volume", value: String(volume)}]})
}

async function getTimeBeforeReplay(req,res){
    var url = host+"/getTimeBeforeReplay"
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
    var g = req.body.g
    var b = req.body.b
    var source = req.body.source
    var mod = req.body.led_mod
    var result = await request.post({
        'url': url, 
        'headers': headers,
        formData : {
            intensity:intensity,
            R:r,
            G:g,
            B:b,
            led_mod:mod
        }
        
    });
    saveBDD(req.body.id,{date: new Date(), source:source, variables:[{name: "state", value: String(state)},{name: "intensity", value: String(intensity)},{name: "r", value: String(r),},{name: "g", value: String(g),},{name: "b", value: String(b),},{name: "mod", value: String(mod),}]})
    res.json(result)
}

async function modifyTimeBeforeReplay(req,res){
    var url = host+"/modifyTimeBeforeReplay"
    var time = req.body.time
    var result = await request.post({
        'url': url, 
        'headers': headers,
        formData : {
            time:time,
        }
        
    });
    res.json(result)
}


async function playHP(req,res){
    var url = host+"/playHP"
    var state = req.body.state
    var source = "API"
    var result = await request({
        'url': url, 
        'headers': headers,
    });
    saveBDD( req.body.id,{date: new Date(), source:source, variables: [{name: "state", value: String(state)}]})
    res.json(result)
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

async function findUserByCredentials(req,res){
    var connexion;
    try{
        await models.User.findOne({ email: req.body.email, password: req.body.password}, function(err, result) {
            if (err) { console.log(err);}
                
            if (result) {
                connexion = "Found";
            } else {
                connexion = "Not Found";
            }
        });
    }catch(e){
        console.error(e);
        res.status(500).send("error requesting database");

    }finally{
        res.json(connexion)
    }

}

async function createUser(req,res){
    var response = 0;
    try{
        console.log(req.body.nom);
        const user = new models.User({
            nom :  req.body.nom,
            prenom:  req.body.prenom,
            age :  req.body.age,
            sexe : req.body.sexe,
            email: req.body.email, 
            password: req.body.password,
            adresse :  req.body.adresse,
            ville :  req.body.ville,
            pays :  req.body.pays,
        });

        user.save();

    }catch(e){
        console.error(e);
        res.status(500).send("error requesting database");

    }finally{
        res.json(response)
    }
}

module.exports.modifyColor = modifyColor;  
module.exports.getHpIsPlaying = getHpIsPlaying;  
module.exports.getLedValues = getLedValues;  
module.exports.getTouchSensor = getTouchSensor;  
module.exports.getPushSensor = getPushSensor;  
module.exports.getIntensitySensor = getIntensitySensor;  
module.exports.getPresenceSensor = getPresenceSensor;  
module.exports.playHP = playHP;
module.exports.getAllDevice = getAllDevice;
module.exports.getOneDevice = getOneDevice; 
module.exports.modifyTimeBeforeReplay = modifyTimeBeforeReplay;
module.exports.getTimeBeforeReplay = getTimeBeforeReplay;
module.exports.findUserByCredentials = findUserByCredentials;
module.exports.createUser = createUser;