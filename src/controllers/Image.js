const Image = require('../models/Image.js')
const User = require('../models/User.js')
const cloudinary = require('../utils/Cloudinary.js')

const ImageController = {
  // Create image
  createImage: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.body.image_url, {
        folder: 'images'
      })

      const newImage = new Image({
        ...req.body,
        image_url: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })

      const savedImage = await newImage.save()

      if (req.body.author) {
        const author = User.findById(req.body.author)
        await author.updateOne({ $push: { created_images: savedImage._id } })
      }

      res.status(201).json(savedImage)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Get images
  getImages: async (req, res) => {
    try {
      const query = req.query.query || ''
      const page = parseInt(req.query.page) || 1
      if (page < 1) page = 1
      const limit = parseInt(req.query.limit) || 30
      const skip = (page - 1) * limit

      const images = await Image.find({
        $or: [
          {
            title: { $regex: query, $options: 'i' }
          },
          {
            category: { $regex: query, $options: 'i' }
          }
        ]
      })
        .sort('title')
        .skip(skip)
        .limit(limit)
        .populate('author')

      res.status(200).json(images)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // get images by id author
  getImagesByIdUser: async (req, res) => {
    try {
      const images = await Image.find({ author: req.params.id }).sort('title')
      res.status(200).json(images)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // get images favorites by id author
  getImagesFavoriteByIdUser: async (req, res) => {
    try {
      const images = await Image.find({ favorites: req.params.id }).sort(
        'title'
      )
      res.status(200).json(images)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Get image
  getImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id)
        .populate('author')
        .populate('favorites')

      res.status(200).json(image)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Update image
  updateImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id)

      if (req.body.image_url && req.body.image_url !== '') {
        const ImgId = image.image_url.public_id
        if (ImgId) {
          await cloudinary.uploader.destroy(ImgId)
        }
        const newImage = await cloudinary.uploader.upload(req.body.image_url, {
          folder: 'images'
        })
        req.body.image_url = {
          public_id: newImage.public_id,
          url: newImage.secure_url
        }
      }

      await image.updateOne({ $set: req.body })
      res.status(201).json('Updated image successfully!')
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      const image = await Image.findById(req.params.id)
      const imgId = image.image_url.public_id

      if (imgId) {
        cloudinary.uploader.destroy(imgId, {
          type: 'upload',
          resource_type: 'image'
        })
      }

      await User.updateMany(
        { created_images: req.params.id },
        { $pull: { created_images: req.params.id } }
      )

      await Image.findByIdAndDelete(req.params.id)
      res.status(201).json('Deleted image successfully!')
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = ImageController
