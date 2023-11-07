const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const AuthRouter = require('./routes/Auth.js')
const UserRouter = require('./routes/User.js')
const ImageRouter = require('./routes/Image.js')

dotenv.config()
const app = express()
const port = process.env.PORT || 3001

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('Connect to mongodb successfully!'))
  .catch((error) => console.log(error))

app.use(cors())
app.use(express.json())

// Auth
app.use('/api/auth', AuthRouter)
// Users
app.use('/api/user', UserRouter)
// Images
app.use('/api/image', ImageRouter)

app.listen(port, () => {
  console.log(`Server is running!`)
})
