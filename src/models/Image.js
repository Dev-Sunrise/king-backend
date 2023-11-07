const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true
    },
    description: {
      type: String
    },
    image_url: {
      public_id: {
        type: String,
        require: true
      },
      url: {
        type: String,
        require: true
      }
    },
    category: {
      type: String,
      require: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('Image', imageSchema)
