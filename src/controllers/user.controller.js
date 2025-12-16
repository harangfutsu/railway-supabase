const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require("uuid")
const { sendVerificationEmail } = require("../services/mailer.service")
const userModel = require('../models/user.model')
const {successHandler, errorHandler} = require('../utils/helper.responses')

const getAllUsers = async (req, res) => {
    
    try {
        const allUser = await userModel.getAllUsers()

        if (allUser.rowCount === 0){

            return errorHandler(
                res, 
                false, 
                404, 
                "Belum ada user terdaftar")}

        return successHandler(
            res, 
            true, 
            200, 
            "Menampilkan seluruh user", 
            allUser.rows)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const createUser = async (req, res) => {
    try {
        const {fullName, email, gender, country, phone, password } = req.body

        if (!fullName || !email || !gender || !country || !phone || !password) {
            return errorHandler(
                res, 
                false, 
                400, 
                "Semua field wajib diisi")}

        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const verificationToken = uuidv4()

        const createdUser = await userModel.createUser(
            fullName,  
            email,
            gender,
            country,
            phone, 
            hashedPassword,
            verificationToken)

        if (createdUser.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                400, 
                "Gagal membuat user")}

        sendVerificationEmail(email, verificationToken)
        .then((status) => {
            if (!status) console.log("⚠️ Email verifikasi gagal dikirim ke:", email)
        })
        .catch((err) => console.error("Send email error:", err))

        return successHandler(
            res, 
            true, 
            201, 
            "User berhasil dibuat. Silakan cek email untuk verifikasi akun.", 
            createdUser.rows)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Inernal Server Error: ${error.message}`)}
}

const updateUser = async (req, res) => {
    try {
        const {userId} = req.params
        const {fullName, email, gender, country, phone, password} = req.body 

        if (!fullName || !email || !gender || !country || !phone || !password ) {

            return errorHandler(
                res, 
                false, 
                400, 
                "Semua field wajib diisi")}
        
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const updatedUser = await userModel.updateUser(userId, fullName, email, gender, country, phone, hashedPassword)

        if (updatedUser.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "Gagal memperbarui user")}
        
        return successHandler(
            res, 
            true, 
            200, 
            "User berhasil diperbarui", 
            updatedUser.rows[0])

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const deleteUser = async (req, res) => {
    try {
        const {userId} = req.params

        const user = await userModel.getUserById(userId)

        if (user.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "User id tidak ditemukan")
        }
        
        const deletedUser = await userModel.deleteUser(userId)

        if (deletedUser.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "User gagal dihapus")}

        return successHandler(
            res, 
            true, 
            200, 
            "User berhasil dihapus", deletedUser.rows[0])

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const getUserById = async (req, res) => {
    try {
        const {userId} = req.params

        const user = await userModel.getUserById(userId)

        if (user.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "User tidak ditemukan")}

        return successHandler(
            res, 
            true, 
            200, 
            "User berhasil ditemukan", 
            user.rows[0])

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password ) {
            return errorHandler(res, false, 400, "Email dan password wajib diisi")
        }

        const user = await userModel.getUserByEmail(email)

        if (user.rowCount === 0) {
            return errorHandler(res, false, 400, "Email atau password salah")
        }

        const foundUser = user.rows[0]

        if (!foundUser.is_verified) {
            return errorHandler(
                res,
                false,
                403,
                "Akun belum diverifikasi. Silakan cek email Anda untuk verifikasi."
            )
        }

        const isMatch = await bcrypt.compare(password, foundUser.password)

        if (!isMatch) {
            return errorHandler(res, false, 401, "Password salah")
        }

        const token = jwt.sign(
            {userId: foundUser.user_id, email : foundUser.email, role: foundUser.role},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN} 
        )

        return successHandler(
            res, 
            true, 
            200, 
            "Login berhasil",
            {
                token,
                user : {
                    userId : foundUser.user_id,
                    fullName : foundUser.fullname,
                    email : foundUser.email,
                    gender : foundUser.gender,
                    country : foundUser.country,
                    phone : foundUser.phone
                }
            }
        )

    } catch (error) {
        return errorHandler(res, false, 500, `Internal server Error: ${error.message}`)

    }

}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query

        if (!token) {
            return errorHandler(
                res,
                false,
                400,
                "Verification token diperlukan"
            )
        }

        const user = await userModel.getUserByVerificationToken(token)

        if (!user || user.rowCount === 0) {
            return errorHandler(
                res,
                false,
                400,
                "Invalid Verification Token"
            )
        }

        const result = await userModel.verifyUserEmail(token)

        if (result.rowCount === 0) {
            return errorHandler(res, false, 400, "Token sudah tidak valid")
        }

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })

    } catch (error) {
        return errorHandler(
            res,
            false,
            500,
            `Internal Server Error: ${error.message}`
        )
    }
}

const getMe = async (req, res) => {
    try {

    const userId = req.user.userId;

    const user = await userModel.getUserById(userId)

    if (user.rowCount === 0) {
        return errorHandler(
            res,
            false,
            404,
            "User tidak ditemukan"
        )
        }

        return successHandler(
        res,
        true,
        200,
        "Data user login",
        user.rows[0]
        )

    } catch (error) {
        return errorHandler(
        res,
        false,
        500,
        `Internal Server Error: ${error.message}`
        );
    }
}


module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    loginUser,
    verifyEmail,
    getMe

}