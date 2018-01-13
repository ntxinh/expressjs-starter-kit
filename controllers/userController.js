const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mail = require('../handlers/mail')

const User = mongoose.model('User')

exports.getUsers = async (req, res) => {
  const users = await User.find()
  res.json(users)
}

exports.postAuthenticate = async (req, res) => {
  // Get input data
  let email = req.body.email
  let password = req.body.password

  // Find the user
  const user = await User.findOne({ email: email })

  // Check if user exist
  if (!user) {
    return res.json({ success: false, message: 'Authentication failed. User not found.' })
  }

  // Check if password matches
  if (!await bcrypt.compare(password, user.password)) {
    return res.json({ success: false, message: 'Authentication failed. Wrong password.' })
  }

  // Create a token with only our given payload
  let token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })

  // Return the information including token as JSON
  return res.json({
    success: true,
    message: 'Enjoy your token!',
    token: `${process.env.JWT_TOKEN_TYPE} ${token}`
  })
}

exports.postSignUp = async (req, res) => {
  // Get input data
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password

  // Save the user
  const user = new User({ name, email, password })
  await user.save()

  // Send them an email with the token
  const tokenConfirm = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15h' })
  const resetURL = `http://${req.headers.host}/confirm-sign-up?token=${tokenConfirm}`
  await mail.send({
    user,
    filename: 'confirm-sign-up',
    subject: 'Confirm Sign Up',
    resetURL
  })

  return res.json({
    success: true,
    message: 'Sign up successfully!',
    user
  })
}

exports.getConfirmSignUp = async (req, res) => {
  // Get input data
  let token = req.query.token

  // Decode token
  if (token) {
    // Verifies secret and checks exp
    try {
      let decoded = await jwt.verify(token, process.env.JWT_SECRET)
      let email = decoded.email

      // Enable user
      let user = await User.findOne({ email })
      user.enable = true
      await user.save()

      return res.json({
        success: true,
        message: 'Sign up successfully!',
        user
      })
    } catch (err) {
      return res.json({ error: err })
    }
  }

  return res.json({ error: 'Not found token' })
}
