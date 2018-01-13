const jwt = require('jsonwebtoken')

const responses = require('../common/responses/responses')

exports.getAuthorize = async (req, res, next) => {
  // Check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization']

  // Check exist token
  if (!token) {
    return res.json(
      new responses.FailResponse.Builder()
        .withMessage('Token Not Found')
        .build()
    )
  }

  // Decode token
  // Verifies secret and checks exp
  try {
    let decoded = await jwt.verify(token.replace(process.env.JWT_TOKEN_TYPE, '').trim(), process.env.JWT_SECRET)
    // Save decoded to request
    req.decoded = decoded
    return next()
  } catch (err) {
    return res.json(
      new responses.FailResponse.Builder()
        .withContent(err)
        .build()
    )
  }
}
