const router = require('express').Router();
const courseControllers = require('../controllers/courses.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRole } = require('../middlewares/role.middleware');

// semua user bisa melihat & menambah
router.get('/course', verifyToken, courseControllers.getAllCourse);
router.get('/course/:id', verifyToken, courseControllers.getCourseById);
router.post('/course', verifyToken, authorizeRole(['admin']), courseControllers.createCourse);
router.put('/course/:id', verifyToken, authorizeRole(['admin']), courseControllers.updateCourse);

// hanya admin boleh hapus
router.delete('/course/:id', verifyToken, authorizeRole(['admin']), courseControllers.deleteCourse);

module.exports = router;
