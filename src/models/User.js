const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    password: {
      type: String,
      require: true
    },
    avatar_url: {
      public_id: {
        type: String,
        require: true
      },
      url: {
        type: String,
        require: true
      }
    },
    created_images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    favorited_images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
