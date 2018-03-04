const mongoose = require('mongoose')
const jwtHelpers = require('../../helpers/jwtHelpers')

const User = mongoose.model('User')

exports.findUserCurrent = async (token) => {
  // Decode token
  try {
    let decoded = await jwtHelpers.decode(token, process.env.JWT_SECRET)
    let email = decoded.payload.email
    // Find user
    let user = await User.findOne({ email })
    return user
  } catch (err) {
    throw new Error(err)
  }
}
