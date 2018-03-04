const jwt = require('jsonwebtoken')

exports.encode = (payload) => {
  let token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1h' })
  return token
}

exports.decode = async (token) => {
  let decoded = await jwt.verify(token, process.env.JWT_SECRET)
  return decoded
}
