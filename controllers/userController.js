const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = mongoose.model('User')

exports.getUsers = async (req, res) => {
    const users = await User.find()
    res.json(users)
}

exports.postAuthenticate = async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    // find the user
    const user = await User.findOne({ email: email })

    // check if user exist
    if (!user) {
        return res.json({ success: false, message: 'Authentication failed. User not found.' })
    }

    // check if password matches
    if (user.password != password) {
        return res.json({ success: false, message: 'Authentication failed. Wrong password.' })
    }

    // create a token with only our given payload
    let token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' })

    // return the information including token as JSON
    return res.json({
        success: true,
        message: 'Enjoy your token!',
        token: `${process.env.JWT_TOKEN_TYPE} ${token}`
    })
}