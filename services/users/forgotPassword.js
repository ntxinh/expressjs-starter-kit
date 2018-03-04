const mongoose = require('mongoose')

const User = mongoose.model('User')
const mailHelpers = require('../../helpers/mailHelpers')
const jwtHelpers = require('../../helpers/jwtHelpers')

exports.forgotPassword = async (email, host) => {
  // 1. See if a user with that email exists
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('No account with that email exists.')
  }
  // 2. Set reset tokens and expiry on their account
  user.resetPasswordToken = jwtHelpers.encode({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save()
  // 3. Send them an email with the token
  const resetURL = `http://${host}/api/confirm-reset-password?token=${user.resetPasswordToken}`
  await mailHelpers.send({
    user,
    filename: 'password-reset',
    subject: 'Password Reset',
    resetURL
  })

  return user
}
