const User = require('../models/User.js')
const bcrypt = require('bcrypt')
const cloudinary = require('../utils/Cloudinary.js')

const AuthController = {
  // Register
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(req.body.password, salt)
      const result = await cloudinary.uploader.upload(req.body.avatar_url, {
        folder: 'avatars'
      })

      const newUser = new User({
        ...req.body,
        password: hashed,
        avatar_url: {
          public_id: result.public_id,
          url: result.secure_url
        }
      })

      const user = await newUser.save()
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  // Login
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email })
      if (!user) {
        res.status(404).json('Your email is incorrect!')
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      )
      if (!validPassword) {
        res.status(404).json('Your password is incorrect!')
      }

      if (user && validPassword) {
        const { password, ...others } = user._doc
        res.status(200).json({ ...others })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  }
}

module.exports = AuthController
