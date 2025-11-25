const router = require('express').Router()
const courseControllers = require('../controllers/course.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/course', authMiddleware.verifyToken, courseControllers.getAllCourse) 
router.get('/course/:id', authMiddleware.verifyToken, courseControllers.getCourseById)
router.put('/course/:id', authMiddleware.verifyToken, courseControllers.updateCourse)
router.delete('/course/:id', authMiddleware.verifyToken, courseControllers.deleteCourse)
router.post('/course', authMiddleware.verifyToken, courseControllers.createCourse)

module.exports = router;