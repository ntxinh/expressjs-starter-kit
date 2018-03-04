const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

// Import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' })

// Connect to our Database and handle an bad connections
mongoose.connect(process.env.DATABASE, { useMongoClient: true })
mongoose.Promise = global.Promise // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`-> ${err.message}`)
})

// READY?! Let's go!

// Import all of our models
const modelsPath = path.join(__dirname, 'models')
fs.readdirSync(modelsPath).forEach(function (file) {
  require(path.join(modelsPath, file))
})

// Start our app!
const app = require('./app')
app.set('port', process.env.PORT || 7777)
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`)
})
