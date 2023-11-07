const express = require('express')
const ImageController = require('../controllers/Image.js')

const router = express.Router()

// Create image
router.post('/create', ImageController.createImage)
// Get all category, pagination images
router.get('/all', ImageController.getImages)
// Get image
router.get('/:id', ImageController.getImage)
// Get images by id author
router.get('/byAuthor/:id', ImageController.getImagesByIdUser)
// Get images favorite by id author
router.get('/favoriteByAuthor/:id', ImageController.getImagesFavoriteByIdUser)
// Update image
router.put('/update/:id', ImageController.updateImage)
// Delete image
router.delete('/delete/:id', ImageController.deleteImage)

module.exports = router
