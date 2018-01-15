const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')

const User = mongoose.model('User')
const mailHelpers = require('../helpers/mailHelpers')
const { SuccessResponse, FailResponse } = require('../helpers/responseHelpers')
const { randomPassword } = require('../helpers/stringHelpers')
const logger = require('../helpers/loggerHelpers')

exports.getUsers = async (req, res) => {
  const users = await User.find()
  res.json(
    new SuccessResponse.Builder()
      .withContent(users)
      .build()
  )
}

exports.postAuthenticate = async (req, res) => {
  // Get input data
  let email = req.body.email
  let password = req.body.password

  // Find the user
  const user = await User.findOne({ email, enable: true })

  // Check if user exist
  if (!user) {
    logger.warn('Authentication failed. User not found.')
    return res.json(
      new FailResponse.Builder()
        .withMessage('Authentication failed. User not found.')
        .build()
    )
  }

  // Check if password matches
  if (!await bcrypt.compare(password, user.password)) {
    logger.warn('Authentication failed. Wrong password.')
    return res.json(
      new FailResponse.Builder()
        .withMessage('Authentication failed. Wrong password.')
        .build()
    )
  }

  // Create a token with only our given payload
  let token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  logger.info(`Auth token created: ${token}`)

  // Return the information including token as JSON
  return res.json(
    new SuccessResponse.Builder()
      .withContent({ token: `${process.env.JWT_TOKEN_TYPE} ${token}` })
  )
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
  const tokenConfirm = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15d' })
  const resetURL = `http://${req.headers.host}/api/confirm-sign-up?token=${tokenConfirm}`
  await mailHelpers.send({
    user,
    filename: 'confirm-sign-up',
    subject: 'Confirm Sign Up',
    resetURL
  })

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .build()
  )
}

exports.getConfirmSignUp = async (req, res) => {
  // Get input data
  let token = req.query.token

  // Check exist token
  if (!token) {
    return res.json(
      new FailResponse.Builder()
        .withMessage('Token Not Found')
        .build()
    )
  }

  // Decode token
  // Verifies secret and checks exp
  try {
    let decoded = await jwt.verify(token, process.env.JWT_SECRET)
    let email = decoded.email

    // Enable user
    let user = await User.findOne({ email })
    user.enable = true
    await user.save()

    // Create response
    return res.json(
      new SuccessResponse.Builder()
        .withContent(user)
        .build()
    )
  } catch (err) {
    logger.error(`Token Decode Error ${err}`)
    return res.json(
      new FailResponse.Builder()
        .withContent(err)
        .withMessage('Token Decode Error')
        .build()
    )
  }
}

exports.getTestAxios = async (req, res) => {
  // Grab some data over an Ajax request
  const xinh = await axios('https://api.github.com/users/nguyentrucxinh')

  // Many requests should be concurrent - don't slow things down!
  // Fire off two requests and save their promises
  const userPromise = axios('https://randomuser.me/api/')
  const namePromise = axios('https://uinames.com/api/')
  // Await all three promises to come back and destructure the result into their own variables
  const [user, name] = await Promise.all([userPromise, namePromise])

  return res.json(
    new SuccessResponse.Builder()
      .withContent({ xinh: xinh.data, user: user.data, name: name.data })
      .build()
  )
}

exports.postForgotPassword = async (req, res) => {
  // Get input data
  let email = req.body.email

  // 1. See if a user with that email exists
  const user = await User.findOne({ email })
  if (!user) {
    return res.json(
      new FailResponse.Builder()
        .withMessage('No account with that email exists.')
        .build()
    )
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save()
  // 3. Send them an email with the token
  const resetURL = `http://${req.headers.host}/api/confirm-reset-password?token=${user.resetPasswordToken}`
  await mailHelpers.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  })

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .withMessage('You have been emailed a password reset link.')
      .build()
  )
}

exports.getConfirmResetPassword = async (req, res) => {
  // Get input data
  let token = req.query.token

  // See if a user with that token exists
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    return res.json(
      new FailResponse.Builder()
        .withMessage('Password reset is invalid or has expired')
        .build()
    )
  }

  // Generate new password
  let password = randomPassword()
  logger.info(`Password was generated: ${password}`)
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .withMessage(`Your password is: ${password}`)
      .build()
  )
}
