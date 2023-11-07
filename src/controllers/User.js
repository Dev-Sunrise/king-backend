const User = require('../models/User.js')
const Image = require('../models/Image.js')
const cloudinary = require('../utils/Cloudinary.js')

const UserController = {
  // Get user
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
        .populate('created_images')
        .populate('favorited_images')
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)

      if (req.body.avatar_url && req.body.avatar_url !== '') {
        const UserId = user.avatar_url.public_id
        if (UserId) {
          await cloudinary.uploader.destroy(UserId)
        }
        const newImageUser = await cloudinary.uploader.upload(
          req.body.avatar_url,
          {
            folder: 'avatars'
          }
        )
        req.body.avatar_url = {
          public_id: newImageUser.public_id,
          url: newImageUser.secure_url
        }
      }

      await user.updateOne({ $set: req.body })
      res.status(201).json('Updated user successfully!')
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Create favorite image
  createFavoriteImage: async (req, res) => {
    try {
      if (req.body.authorId) {
        const author = User.findById(req.body.authorId)
        await author.updateOne({
          $push: { favorited_images: req.body.imageId }
        })
      }

      if (req.body.imageId) {
        const image = Image.findById(req.body.imageId)
        await image.updateOne({
          $push: { favorites: req.body.authorId }
        })
      }

      res.status(201).json('Favorited image successfully!')
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Delete favorite image
  deleteFavoriteImage: async (req, res) => {
    try {
      if (req.body.authorId) {
        const author = User.findById(req.body.authorId)
        await author.updateOne({
          $pull: { favorited_images: req.body.imageId }
        })
      }

      if (req.body.imageId) {
        const image = Image.findById(req.body.imageId)
        await image.updateOne({
          $pull: { favorites: req.body.authorId }
        })
      }

      res.status(201).json('Deleted favorite image successfully!')
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = UserController
