const pool = require('../database/connection')
const crypto = require('crypto')

const getAllCourse = ({ category, language, search, sortBy, order, limit, page }) =>
    new Promise((resolve, reject) => {
        let sql = `
            SELECT 
                c.course_id,
                c.title,
                c.category,
                c.description,
                c.price,
                c.language,
                COALESCE(ROUND(AVG(f.rating), 1), 0) AS avg_rating,
                COUNT(f.rating) AS total_reviews
            FROM courses c
            LEFT JOIN feedbacks f ON c.course_id = f.id_course
        `
        const values = [];
        const conditions = [];

        // Filter
        if (category) {
            conditions.push(`c.category = $${values.length + 1}`)
            values.push(category);
        }

        if (language) {
            conditions.push(`c.language = $${values.length + 1}`)
            values.push(language);
        }

        if (search) {
            conditions.push(`(c.title ILIKE $${values.length + 1} OR c.description ILIKE $${values.length + 2})`)
            values.push(`%${search}%`, `%${search}%`);
        }

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ")
        }

        sql += " GROUP BY c.course_id, c.title, c.category, c.description, c.price, c.language ";

        // Sorting
        if (sortBy) {
            const allowed = {
                "title": "c.title",
                "price": "c.price",
                "category": "c.category",
                "language": "c.language",
                "rating": "avg_rating",
                "reviews": "total_reviews"
            };

            const sortField = allowed[sortBy] || "c.title"
            const sortOrder = order?.toLowerCase() === "desc" ? "DESC" : "ASC"

            sql += ` ORDER BY ${sortField} ${sortOrder}`
        } else {
            sql += ` ORDER BY c.title ASC`
        }

        const limitValue = parseInt(limit)
        const pageValue = parseInt(page)

        if (!isNaN(limitValue) && !isNaN(pageValue)) {

            const safePage = pageValue < 1 ? 1 : pageValue
            const offset = (safePage - 1) * limitValue

            sql += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`
            values.push(limitValue, offset)
        }

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const createCourse = (title, category, description, price, language) =>
    new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO courses (course_id, title, category, description, price, language)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
        const values = [crypto.randomUUID(), title, category, description, price, language]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const updateCourse = (id, title, category, description, price, language) =>
    new Promise((resolve, reject) => {
        const sql = `
            UPDATE courses
            SET title = $1, category = $2, description = $3, price = $4, language = $5
            WHERE course_id = $6
            RETURNING *
        `
        const values = [title, category, description, price, language, id]

        pool.query(sql, values)
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const deleteCourse = (id) =>
    new Promise((resolve, reject) => {
        const sql = `DELETE FROM courses WHERE course_id = $1 RETURNING *`
        pool.query(sql, [id])
            .then(res => resolve(res))
            .catch(err => reject(err))
    })

const getCourseById = (id) =>
    new Promise((resolve, reject) => {
        const sql = `SELECT * FROM courses WHERE course_id = $1`
        pool.query(sql, [id])
            .then(res => resolve(res))
            .catch(err => {
                console.error('QUERY ERROR:', err);      // 👈 log error
                reject(err);
            })
    })

module.exports = {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById
}