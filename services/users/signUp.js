const mongoose = require('mongoose')

const User = mongoose.model('User')
const mailHelpers = require('../../helpers/mailHelpers')
const jwtHelpers = require('../../helpers/jwtHelpers')

exports.signUp = async (name, email, password, host) => {
  // Save the user
  const user = new User({ name, email, password })
  await user.save()

  // Send them an email with the token
  const tokenConfirm = jwtHelpers.encode({ email }, process.env.JWT_SECRET, { expiresIn: '15d' })
  const resetURL = `http://${host}/api/confirm-sign-up?token=${tokenConfirm}`
  await mailHelpers.send({
    user,
    filename: 'confirm-sign-up',
    subject: 'Confirm Sign Up',
    resetURL
  })

  return user
}
