const express = require('express')
const AuthController = require('../controllers/Auth.js')

const router = express.Router()

// Register
router.post('/register', AuthController.registerUser)
// Login
router.post('/login', AuthController.loginUser)

module.exports = router
