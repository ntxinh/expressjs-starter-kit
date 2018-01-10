const express = require('express')
const router = express.Router()

const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const { getAuthorize } = require('../middlewares/authMiddleware')

router.get('/', (req, res) => res.json({ msg: 'Hello world' }))
router.post('/api/authenticate', catchErrors(userController.postAuthenticate))

// Middlewares
router.use(getAuthorize)

router.get('/api/users', catchErrors(userController.getUsers))

module.exports = router