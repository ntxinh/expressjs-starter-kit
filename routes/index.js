const express = require('express')
const router = express.Router()

const { catchErrors } = require('../helpers/errorHandlers')
const userController = require('../controllers/userController')
const { getAuthorize } = require('../middlewares/authMiddleware')

// Unprotected routes
router.get('/', (req, res) => res.json({ msg: process.env.APP_NAME }))
router.post('/api/authenticate', catchErrors(userController.postAuthenticate))
router.post('/api/sign-up', catchErrors(userController.postSignUp))
router.get('/api/confirm-sign-up', catchErrors(userController.getConfirmSignUp))
router.post('/api/forgot-password', catchErrors(userController.postForgotPassword))
router.get('/api/confirm-reset-password', catchErrors(userController.getConfirmResetPassword))

// Middlewares
router.use(getAuthorize)

// Protected routes
router.get('/api/users', catchErrors(userController.getUsers))
router.get('/api/test-axios', catchErrors(userController.getTestAxios))

module.exports = router
