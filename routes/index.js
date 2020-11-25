const router = require('express').Router();
const controller = require('../controllers');

router.post('/modifyColor', (req, res) => {
    controller.modifyColor(req, res);
});

router.get('/allSensor', (req, res) => {
    controller.getAllSensor(req, res);
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

router.get('/hpPlaying', (req, res) => {
    controller.getHpIsPlaying(req, res);
});


router.post('/playHP', (req, res) => {
    controller.playHP(req, res);
});


router.post('/soundFile', (req, res) => {
    controller.sendSoundFile(req, res);
});

module.exports = router;