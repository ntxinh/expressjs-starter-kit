const express = require('express')
const router = express.Router()
const { catchErrors } = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')

router.get('/', (req, res) => res.send('Hello world'))
router.get('/api/users', catchErrors(userController.getUsers))
router.post('/api/authenticate', catchErrors(userController.postAuthenticate))
router.get('/api/authorize', catchErrors(userController.getAuthorize))

module.exports = router