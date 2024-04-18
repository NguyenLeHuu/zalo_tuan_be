const Router = require('express')
const { register, login, verification, passwordRetrieval, checkEmailExists, updatePasswordWhenLogin } = require('../controllers/authController')
const authRouter = Router()


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/verification', verification)
authRouter.post('/password-retrieval', passwordRetrieval)
authRouter.post('/check-email-exists', checkEmailExists)
authRouter.post('/update-password-when-login', updatePasswordWhenLogin)


module.exports = authRouter