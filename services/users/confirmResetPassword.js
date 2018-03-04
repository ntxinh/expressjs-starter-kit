const mongoose = require('mongoose')

const User = mongoose.model('User')
const { randomPassword } = require('../../helpers/stringHelpers')
const logger = require('../../helpers/loggerHelpers')

exports.confirmResetPassword = async (token) => {
  // See if a user with that token exists
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (!user) {
    throw new Error('Password reset is invalid or has expired')
  }

  // Generate new password
  let password = randomPassword()
  logger.info(`Password was generated: ${password}`)
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  return user
}
