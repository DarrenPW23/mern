const router = require('express').Router()

const AuthController = require('./controllers/AuthController')
const { authJWT } = require('./middleware/auth')

router.use('/auth', AuthController)
// router.use('/api', authJWT, authUser)

module.exports = router