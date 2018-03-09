const { FailResponse } = require('../helpers/responseHelpers')
const logger = require('../helpers/loggerHelpers')
const jwtHelpers = require('../helpers/jwtHelpers')

const services = require('../services')

exports.getAuthorize = async (req, res, next) => {
  // Check header or url parameters or post parameters for token
  const headerAuthorize = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization

  // Check exist token
  if (!headerAuthorize) {
    logger.warn('Header Authorize Not Found')
    return res.json(
      new FailResponse.Builder()
        .withMessage('Header Authorize Not Found')
        .build()
    )
  }

  // Get token
  const token = headerAuthorize.replace(process.env.JWT_TOKEN_TYPE, '').trim()

  // Decode token
  // Verifies secret and checks exp
  try {
    const decoded = await jwtHelpers.decode(token, process.env.JWT_SECRET)
    // Save decoded to request
    req.decoded = decoded
    // Save user current to request
    const email = decoded.payload.email
    req.userCurrent = await services.users.findUserByEmail(email)
    return next()
  } catch (err) {
    logger.error(`Token Decode Error ${err}`)
    return res.json(
      new FailResponse.Builder()
        .withContent(err)
        .build()
    )
  }
}
