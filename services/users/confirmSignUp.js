const mongoose = require('mongoose')

const User = mongoose.model('User')
const logger = require('../../helpers/loggerHelpers')
const jwtHelpers = require('../../helpers/jwtHelpers')

exports.confirmSignUp = async (token) => {
  // Check exist token
  if (!token) {
    throw new Error('Token Not Found')
  }

  // Decode token
  // Verifies secret and checks exp
  try {
    let decoded = await jwtHelpers.decode(token, process.env.JWT_SECRET)
    let email = decoded.payload.email

    // Enable user
    let user = await User.findOne({ email })
    user.enable = true
    await user.save()

    // Create response
    return user
  } catch (err) {
    logger.error(`Token Decode Error ${err}`)
    throw new Error(`Token Decode Error ${err}`)
  }
}
