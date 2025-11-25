const router = require('express').Router();
const UserControllers = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

// hanya admin yang boleh lihat semua user dan hapus user
router.get('/users', verifyToken, authorizeRole(['admin']), UserControllers.getAllUsers);
router.delete('/users/:userId', verifyToken, authorizeRole(['admin']), UserControllers.deleteUser);


// bisa diakses oleh semua user
router.post('/register', UserControllers.createUser);
router.post('/login', UserControllers.loginUser);
router.get('/verify-email', UserControllers.verifyEmail);
router.put('/users/:userId', verifyToken, UserControllers.updateUser);
router.get('/users/:userId', verifyToken, UserControllers.getUserById);

module.exports = router;
