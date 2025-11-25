const router = require('express').Router()

const routes = [
    require('./course.route'),
    require('./user.route'),
    require('./upload.route'),
];

routes.forEach((route) => router.use(route))

module.exports = router;