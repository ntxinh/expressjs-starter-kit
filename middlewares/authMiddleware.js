const jwt = require('jsonwebtoken')

exports.getAuthorize = async (req, res, next) => {
  // Check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']

  if (!token) {
    return res.json({ error: 'Not found token' })
  }

  // Decode token
  // Verifies secret and checks exp
  try {
    let decoded = await jwt.verify(token.replace(process.env.JWT_TOKEN_TYPE, '').trim(), process.env.JWT_SECRET)
    // Save decoded to request
    req.decoded = decoded
    return next()
  } catch (err) {
    return res.json({ error: err })
  }
}
