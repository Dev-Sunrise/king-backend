const express = require('express')
const UserController = require('../controllers/User.js')

const router = express.Router()

// Get user
router.get('/:id', UserController.getUser)
// Update user
router.put('/update/:id', UserController.updateUser)
// Create favorite image
router.post('/favorite', UserController.createFavoriteImage)
// Delete favorite image
router.patch('/unfavorite', UserController.deleteFavoriteImage)

module.exports = router
