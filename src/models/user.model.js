const pool = require('../database/connection')
const crypto = require('crypto')

const getAllUsers = () =>
    new Promise((resolve, reject) => {
        const sql = 'SELECT user_id, fullname, email, gender, country, phone FROM users'
        pool.query(sql)
            .then(res => resolve(res.rows))
            .catch(err => reject(err))
    })

const createUser = (fullName, email, gender, country, phone, password, verificationToken) =>
    new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO users (user_id, fullname, email, gender, country, phone, password, verification_token, is_verified, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, 'user')
            RETURNING user_id, fullname, email, gender, country, phone
        `
        const values = [crypto.randomUUID(), fullName, email, gender, country, phone, password, verificationToken]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const updateUser = (userId, fullName, email, gender, country, phone, password) =>
    new Promise((resolve, reject) => {
        const sql = `
            UPDATE users
            SET fullname = $1, email = $2, gender = $3, country = $4, phone = $5, password = $6
            WHERE user_id = $7
            RETURNING fullname, email, gender, country, phone
        `
        const values = [fullName, email, gender, country, phone, password, userId]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const deleteUser = (userId) =>
    new Promise((resolve, reject) => {
        const sql = `DELETE FROM users WHERE user_id = $1`
        pool.query(sql, [userId])
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const getUserById = (userId) =>
    new Promise((resolve, reject) => {
        const sql = `SELECT user_id, fullname, email, gender, country, phone, role FROM users WHERE user_id = $1`
        pool.query(sql, [userId])
            .then(res => resolve(res.rows[0]))
            .catch(err => reject(err))
    })

const getUserByEmail = (email) =>
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE email = $1`
        pool.query(sql, [email])
            .then(res => resolve(res.rows))
            .catch(err => reject(err))
    })

const getUserByVerificationToken = (token) =>
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE verification_token = $1`
        pool.query(sql, [token])
            .then(res => resolve(res.rows))
            .catch(err => reject(err))
    })

const verifyUserEmail = (token) =>
    new Promise((resolve, reject) => {
        const sql = `
            UPDATE users
            SET is_verified = true, verification_token = NULL
            WHERE verification_token = $1
        `
        pool.query(sql, [token])
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    getUserByVerificationToken,
    verifyUserEmail
}