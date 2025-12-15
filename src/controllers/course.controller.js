const courseModel = require('../models/course.model')
const {successHandler, errorHandler} = require('../utils/helper.responses')

const getAllCourse = async (req, res) => {
    
    try {
        const {category, language, search, sortBy, order, limit = 6, page = 1} = req.query

        const allCourse = await courseModel.getAllCourse({category, language, search, sortBy, order, limit: Number(limit), page : Number(page)})
        if (!allCourse || allCourse.length === 0){

            return errorHandler(
                res, 
                false, 
                404, 
                "Belum ada course yang terdaftar")}

        return successHandler(
            res, 
            true, 
            200, 
            "Menampilkan seluruh course", 
            allCourse)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const createCourse = async (req, res) => {
    try {
        const {title, category, description, price, language } = req.body

        if (!title || !category || !description || !price || !language) {
            return errorHandler(
                res, 
                false, 
                400, 
                "Semua field wajib diisi")
        }

        const createdCourse = await courseModel.createCourse(title, category, description, price, language)

        if (createdCourse.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                400, 
                "Gagal membuat course")}

        return successHandler(
            res, 
            true, 
            201, 
            "Course berhasil dibuat", 
            createdCourse.rows)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Inernal Server Error: ${error.message}`)}
}

const updateCourse = async (req, res) => {
    try {
        const {id} = req.params
        const {title, category, description, price, language} = req.body 

        if (!title || !category || !description || !price || !language) {

            return errorHandler(
                res, 
                false, 
                400, 
                "Semua field wajib diisi")}

        const updatedCourse = await courseModel.updateCourse(id, title, category, description, price, language)

        if (updatedCourse.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "Gagal memperbarui course")}
        
        return successHandler(
            res, 
            true, 
            200, 
            "Course berhasil diperbarui", 
            updatedCourse.rows)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const deleteCourse = async (req, res) => {
    try {
        const {id} = req.params

        const course = await courseModel.getCourseById(id)
        if (!course) {

            return errorHandler(
                res, 
                false, 
                404, 
                "Course id tidak ditemukan")
        }
        
        const deletedCourse = await courseModel.deleteCourse(id)
        if (deletedCourse.rowCount === 0) {

            return errorHandler(
                res, 
                false, 
                404, 
                "Course gagal dihapus")}

        return successHandler(
            res, 
            true, 
            200, 
            "Course berhasil dihapus", deletedCourse.rows)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

const getCourseById = async (req, res) => {
    try {
        const {id} = req.params

        const course = await courseModel.getCourseById(id)

        if (!course) {

            return errorHandler(
                res, 
                false, 
                404, 
                "Course tidak ditemukan")}

        return successHandler(
            res, 
            true, 
            200, 
            "Course berhasil ditemukan", 
            course)

    } catch (error) {

        return errorHandler(
            res, 
            false, 
            500, 
            `Internal Server Error: ${error.message}`)}
}

module.exports = {
    getAllCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById

}