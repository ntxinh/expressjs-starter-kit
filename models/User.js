const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const md5 = require('md5')
const validator = require('validator')

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: 'Invalid Email Address'
        },
        required: 'Please Supply an email address'
    },
    password: {
        type: String,
        required: 'Please supply a password',
        trim: true
    },
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    hearts: [
        { type: mongoose.Schema.ObjectId, ref: 'Store' }
    ]
})

userSchema.virtual('gravatar').get(function () {
    const hash = md5(this.email)
    return `https://gravatar.com/avatar/${hash}?s=200`
})

module.exports = mongoose.model('User', userSchema)
