const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.getUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}