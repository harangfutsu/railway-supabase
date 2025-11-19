const connection = require('../database/connection')
const crypto = require('crypto')

// models/courses.model.js
const getAllCourse = ({ category, language, search, sortBy, order, limit, page }) =>
  new Promise((resolve, reject) => {
    let baseSql = "FROM courses";
    const values = [];
    const conditions = [];

    // 🔹 FILTER
    if (category) {
      conditions.push("category = ?");
      values.push(category);
    }

    if (language) {
      conditions.push("language = ?");
      values.push(language);
    }

    // 🔹 SEARCH
    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ?)");
      values.push(`%${search}%`, `%${search}%`);
    }

    // 🔹 WHERE
    if (conditions.length > 0) {
      baseSql += " WHERE " + conditions.join(" AND ");
    }

    // 🔹 SORT
    let orderSql = "";
    if (sortBy) {
      const allowedFields = ["title", "price", "category", "language", "created_at"];
      const allowedOrder = ["asc", "desc"];

      const sortField = allowedFields.includes(sortBy) ? sortBy : "title";
      const sortOrder = allowedOrder.includes(order?.toLowerCase()) ? order.toUpperCase() : "ASC";

      orderSql = ` ORDER BY ${sortField} ${sortOrder}`;
    }

    // 🔹 LIMIT & OFFSET
    const limitValue = parseInt(limit) || 5;
    const pageValue = parseInt(page) || 1;
    const offset = (pageValue - 1) * limitValue;

    const dataSql = `SELECT * ${baseSql}${orderSql} LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;

    connection.query(countSql, values, (err, countResult) => {
      if (err) return reject(err);

      const total = countResult[0].total;
      const totalPages = Math.ceil(total / limitValue);

      connection.query(dataSql, [...values, limitValue, offset], (err2, dataResult) => {
        if (err2) return reject(err2);

          resolve({
            data: dataResult,
            total,
            totalPages,
            currentPage: pageValue,
            limit: limitValue,
          });
      });
    });
  });


const createCourse = (title, category, description, price, language) => 
    new Promise((resolve, reject) => {
        const sql = 'INSERT INTO courses (course_id, title, category, description, price, language) VALUES (?,?,?,?,?,?)'
        const values = [crypto.randomUUID(), title, category, description, price, language]
        connection.query(sql, values, (err, results) => {
            if (err) {
                return reject(err)
            }
            console.log('create results: ', results)
            resolve(results)
        })
})

const updateCourse = (id, title, category, description, price, language) => 
    new Promise((resolve, reject) => {
        const sql = 'UPDATE courses SET title = ?, category = ?, description = ?, price = ?, language = ? WHERE course_id = ?'
        const values = [title, category, description, price, language, id]
        connection.query(sql, values, (err, results) => {
            if (err) {
                return reject(err)
            }
            console.log('update results: ', results)
            resolve(results)
        })
})

const deleteCourse = (id) => 
    new Promise((resolve, reject) => {
        const sql = 'DELETE FROM courses WHERE course_id = ?'
        const values = [id]
        connection.query(sql, values, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })
})

const getCourseById = (id) => 
    new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM courses WHERE course_id = ?'
        const values = [id]
        connection.query(sql, values, (err, results) => {
            if (err) {
                return reject(err)
            }
            resolve(results)
        })

})

module.exports = {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById

}