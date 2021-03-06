const router = require('express').Router();
const controller = require('../controllers');

router.post('/modifyColor', (req, res) => {
    controller.modifyColor(req, res);
});


router.get('/allDevice', (req, res) => {
    controller.getAllDevice(req, res);
});

router.get('/oneDevice/:id', (req, res) => {
    controller.getOneDevice(req, res);
});

router.get('/presenceSensor', (req, res) => {
    controller.getPresenceSensor(req, res);
});

router.get('/intensitySensor', (req, res) => {
    controller.getIntensitySensor(req, res);
});

router.get('/pushSensor', (req, res) => {
    controller.getPushSensor(req, res);
});

router.get('/touchSensor', (req, res) => {
    controller.getTouchCaptor(req, res);
});

router.get('/ledValues', (req, res) => {
    controller.getLedValues(req, res);
});

router.post('/hpPlaying', (req, res) => {
    controller.getHpIsPlaying(req, res);
});


router.get('/playHP', (req, res) => {
    controller.playHP(req, res);
});


router.post('/soundFile', (req, res) => {
    controller.sendSoundFile(req, res);
});

router.post('/timeReplayHP', (req, res) => {
    controller.modifyTimeBeforeReplay(req, res);
});

router.get('/getTimeBeforeReplay', (req, res) => {
    controller.getTimeBeforeReplay(req, res);
});

router.post('/connexion', (req, res) => {
    controller.findUserByCredentials(req, res);
});

router.post('/createUser', (req, res) => {
    controller.createUser(req, res);
});


module.exports = router;