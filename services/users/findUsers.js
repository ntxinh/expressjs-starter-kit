const mongoose = require('mongoose')

const User = mongoose.model('User')

exports.findUsers = async () => {
  const users = await User.find()
  return users
}
