const express = require('express');
const jwt = require ('jsonwebtoken')
const router = express.Router();
const authController = require ('../controllers/authController');
const authenticateToken = require('../middleware/authen')

router.post('/register',authController.registerUser);

router.post('/login',authController.loginUser);

router.get ('/profile',authenticateToken, authController.getProfile);

module.exports = router;