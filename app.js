const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const routes = require('./routes/index')

// create our Express app
const app = express()

// Enable All CORS Requests
app.use(cors())

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// use morgan to log requests to the console
app.use(morgan('dev'))

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes)

// done! we export it so we can start the site in start.js
module.exports = app