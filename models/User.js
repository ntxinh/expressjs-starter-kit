const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const md5 = require('md5')
const validator = require('validator')
const bcrypt = require('bcrypt')

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

userSchema.virtual('gravatar').get(() => {
  const hash = md5(this.email)
  return `https://gravatar.com/avatar/${hash}?s=200`
})

userSchema.pre('save', async (next) => {
  try {
    if (!this.isModified('password')) {
      return next() // skip it & stop this function from running
    }

    // generate a salt
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))

    // hash the password along with our new salt
    const hash = await bcrypt.hash(this.password, salt)

    // override the cleartext password with the hashed one
    this.password = hash

    return next()
  } catch (e) {
    return next(e)
  }
})

module.exports = mongoose.model('User', userSchema)
