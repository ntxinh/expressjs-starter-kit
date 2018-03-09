const mongoose = require('mongoose')

const User = mongoose.model('User')

exports.findUserByEmail = async (email) => {
  const user = await User.findOne({ email })
  return user
}
