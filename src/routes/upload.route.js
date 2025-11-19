const router = require("express").Router();
const UploadControllers = require("../controllers/upload.controller");
const { verifyToken } = require('../middlewares/auth.middleware');

router.post("/upload", verifyToken, UploadControllers.uploadFile);

module.exports = router;
