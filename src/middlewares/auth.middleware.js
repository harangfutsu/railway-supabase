const jwt = require('jsonwebtoken')
const { errorHandler } = require('../utils/helper.responses')

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return errorHandler(res, false, 401, "Akses ditolak, Token tidak ditemukan")
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return errorHandler(res, false, 401, "Format token tidak valid")
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()

    } catch (error) {
        return errorHandler(res, false, 403, "Autentikasi gagal: Token tidak valid atau kaluwarsa")

    }
}

module.exports = {verifyToken}