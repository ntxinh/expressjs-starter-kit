const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const routes = require('./routes/index')

// create our Express app
const app = express()

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// After allllll that above middleware, we finally handle our own routes!
app.use('/', routes)

// done! we export it so we can start the site in start.js
module.exports = app