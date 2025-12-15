const router = require('express').Router()
const userControllers = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const roleMiddleware = require('../middlewares/role.middleware')

router.get('/users', authMiddleware.verifyToken, roleMiddleware.authorizeRole(['admin']), userControllers.getAllUsers) 
router.put('/users/:userId', authMiddleware.verifyToken, userControllers.updateUser)
router.delete('/users/:userId', authMiddleware.verifyToken, userControllers.deleteUser)
router.get('/users/:userId', authMiddleware.verifyToken, userControllers.getUserById)

router.post('/login', userControllers.loginUser,)
router.post('/register', userControllers.createUser)
router.get('/verify-email', userControllers.verifyEmail)

router.get('/me', authMiddleware.verifyToken, userControllers.getMe)

module.exports = router