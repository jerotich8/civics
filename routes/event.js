const express = require('express');
const jwt = require ('jsonwebtoken')
const router = express.Router();
const eventController = require ('../controllers/eventController');
const authenticateToken = require('../middleware/authen')

router.post ('/events',authenticateToken,eventController.addEvent);

router.get ('/events',eventController.getEvents);

module.exports = router;
