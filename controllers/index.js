const request = require("request-promise");
const models = require("../schemas");
let fs = require('fs');
var host = "http://192.168.1.15:80";
headers = {
    "Content-Type": "application/json",
}



async function getPresenceSensor(req, res) {
    var url = host + "/getPresenceSensor"
    var result = await request({
        'url': url,
        'headers': headers,
    });
    res.json(JSON.parse(result))
}

async function getIntensitySensor(req, res) {
    var url = host + "/getIntensitySensor"
    var result = await request({
        'url': url,
        'headers': headers,
    });
    res.json(JSON.parse(result))
}



async function getLedValues(req, res) {
    var url = host + "/getLedValues"
    var result = await request({
        'url': url,
        'headers': headers,
    });
    res.json(JSON.parse(result))
}

async function getHpIsPlaying(req, res) {

    console.log(req.body.source)
    saveBDD("hp1", { date: new Date(), source:req.body.source, variables: [{ name: "timeBeforeReplay", value: String(req.body.time) }] })
    
}

async function getTimeBeforeReplay(req, res) {
    var url = host + "/getTimeBeforeReplay"
    var result = await request({
        'url': url,
        'headers': headers,
    });
    res.json(JSON.parse(result))
}

async function modifyColor(req, res) {
    var url = host + "/modifyColor"
    var intensity = req.body.intensity
    var r = req.body.R
    var g = req.body.G
    var b = req.body.B
    var mod = req.body.mod
    var result = await request.post({
        'url': url,
        'headers': headers,
        formData: {
            intensity: intensity,
            R: r,
            G: g,
            B: b,
            led_mod: mod
        }

    });
    saveBDD("led1", { date: new Date(), source: "app", variables: [{ name: "intensity", value: String(intensity) }, { name: "r", value: String(r), }, { name: "g", value: String(g), }, { name: "b", value: String(b), }, { name: "mod", value: String(mod), }] })
    //console.log(result)
    res.json(JSON.parse(result))
}

async function modifyTimeBeforeReplay(req, res) {
    var url = host + "/modifyTimeBeforeReplay"
    var time = req.body.time
    var result = await request.post({
        'url': url,
        'headers': headers,
        formData: {
            time: time,
        }

    });
    saveBDD("hp1", { date: new Date(), source: "app", variables: [{ name: "timeBeforeReplay", value: String(time) }] })
    res.json(result)
}


async function playHP(req, res) {
    var url = host + "/playHP"
    var source = "app"
    var result = await request({
        'url': url,
        'headers': headers,
    });
    saveBDD("hp1", { date: new Date(), source: source, variables: [{ name: "state", value: "On" }] })
    res.json(result)
}


async function saveBDD(id, newValue) {
    try {
        await models.Device.updateOne(
            { _id: id },
            { $push: { stateList: [newValue] } });
    } catch (e) {
        console.error(e)
    }
}

async function getAllDevice(req, res) {
    var devices;
    try {
        devices = await models.Device.find()
    } catch (e) {
        console.error(e);
        res.status(500).send("error requesting database");

    } finally {
        res.json(devices)
    }
}

async function getOneDevice(req, res) {
    var deviceHist;
    try {
        deviceHist = await models.Device.findOne({ _id: req.params.id })
    } catch (e) {
        console.error(e);
        res.status(500).send("error requesting database");

    } finally {

        res.json(deviceHist)
    }
}

async function findUserByCredentials(req, res) {
    var connexion;
    try {
        await models.User.findOne({ email: req.body.email, password: req.body.password }, function (err, result) {
            if (err) { console.log(err); }

            if (result) {
                connexion = "Found";
            } else {
                connexion = "Not Found";
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("error requesting database");

    } finally {
        res.json(connexion)
    }

}

async function createUser(req, res) {
    var response = 0;
    response = await models.User.exists({ email: req.body.email }, function (err, doc) {
        if (err) {
            console.log(err)
        } else {
            console.log("Result :", doc) // false 
            response = doc;
            if (!response) {
                try {
                    console.log(req.body.nom);
                    const user = new models.User({
                        nom: req.body.nom,
                        prenom: req.body.prenom,
                        age: req.body.age,
                        sexe: req.body.sexe,
                        email: req.body.email,
                        password: req.body.password,
                        adresse: req.body.adresse,
                        ville: req.body.ville,
                        pays: req.body.pays,
                    });
                    user.save();
                } catch (e) {
                    console.error(e);
                    res.status(500).send("error requesting database");

                } finally {
                    res.json("true")
                }
            }
            else {
                res.json("false")
            }
        }
    });

}

module.exports.modifyColor = modifyColor;
module.exports.getHpIsPlaying = getHpIsPlaying;
module.exports.getLedValues = getLedValues;
module.exports.getIntensitySensor = getIntensitySensor;
module.exports.getPresenceSensor = getPresenceSensor;
module.exports.playHP = playHP;
module.exports.getAllDevice = getAllDevice;
module.exports.getOneDevice = getOneDevice;
module.exports.modifyTimeBeforeReplay = modifyTimeBeforeReplay;
module.exports.getTimeBeforeReplay = getTimeBeforeReplay;
module.exports.findUserByCredentials = findUserByCredentials;
module.exports.createUser = createUser;