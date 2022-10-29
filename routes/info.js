const express = require('express');
const router = express.Router();

const infoController = require('../controllers/info')

router.get('/' , infoController.handleInfo);

module.exports = router ;