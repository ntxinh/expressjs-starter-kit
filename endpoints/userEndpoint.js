const services = require('../services')
const { SuccessResponse } = require('../helpers/responseHelpers')

exports.getUsers = async (req, res) => {
  const users = await services.users.findUsers()

  return res.json(
    new SuccessResponse.Builder()
      .withContent(users)
      .build()
  )
}

exports.postAuthenticate = async (req, res) => {
  // Get input data
  let email = req.body.email
  let password = req.body.password

  let token = await services.users.authenticate(email, password)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(token)
  )
}

exports.postSignUp = async (req, res) => {
  // Get input data
  let name = req.body.name
  let email = req.body.email
  let password = req.body.password

  const user = await services.users.signUp(name, email, password, req.headers.host)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .build()
  )
}

exports.getConfirmSignUp = async (req, res) => {
  // Get input data
  let token = req.query.token

  const user = await services.users.confirmSignUp(token)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .build()
  )
}

exports.getTestAxios = async (req, res) => {
  const data = await services.users.testAxios()

  return res.json(
    new SuccessResponse.Builder()
      .withContent(data)
      .build()
  )
}

exports.postForgotPassword = async (req, res) => {
  // Get input data
  let email = req.body.email

  const user = await services.users.forgotPassword(email, req.headers.host)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .withMessage('You have been emailed a password reset link.')
      .build()
  )
}

exports.getConfirmResetPassword = async (req, res) => {
  // Get input data
  let token = req.query.token

  const user = await services.users.confirmResetPassword(token)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .withMessage(`Your password is: `)
      .build()
  )
}

exports.getUserCurrent = async (req, res) => {
  // Get token from request
  const token = (req.headers.authorization).replace(process.env.JWT_TOKEN_TYPE, '').trim()

  const user = await services.users.findUserCurrent(token)

  return res.json(
    new SuccessResponse.Builder()
      .withContent(user)
      .build()
  )
}
