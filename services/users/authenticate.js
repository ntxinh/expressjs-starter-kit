const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = mongoose.model('User')
const logger = require('../../helpers/loggerHelpers')
const jwtHelpers = require('../../helpers/jwtHelpers')

exports.authenticate = async (email, password) => {
  // Find the user
  const user = await User.findOne({ email, enable: true })

  // Check if user exist
  if (!user) {
    logger.warn('Authentication failed. User not found.')
    throw new Error('Authentication failed. User not found.')
  }

  // Check if password matches
  if (!await bcrypt.compare(password, user.password)) {
    logger.warn('Authentication failed. Wrong password.')
    throw new Error('Authentication failed. Wrong password.')
  }

  // Create a token with only our given payload
  let token = jwtHelpers.encode({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  logger.info(`Auth token created: ${token}`)

  // Return the information including token as JSON
  return { token: `${process.env.JWT_TOKEN_TYPE} ${token}` }
}
