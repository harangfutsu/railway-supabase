    const courseModel = require('../models/courses.model')
    const {successHandler, errorHandler} = require('../utils/helper.responses')

// controllers/courses.controller.js
const getAllCourse = async (req, res) => {
  try {
    const { category, language, search, sortBy, order, limit = 5, page = 1 } = req.query;

    const result = await courseModel.getAllCourse({
      category,
      language,
      search,
      sortBy,
      order,
      limit,
      page,
    });

    if (!result.data || result.data.length === 0) {
      return errorHandler(res, false, 404, "Belum ada course yang sesuai dengan kriteria");
    }

    return successHandler(res, true, 200, "Menampilkan seluruh course", result);
  } catch (error) {
    return errorHandler(res, false, 500, `Internal Server Error: ${error.message}`);
  }
};

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

            if (!createdCourse.affectedRows) {

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
                req.body)

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

            if (!updatedCourse.affectedRows) {

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
                {id, ...req.body})

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

            if (!course || course.length === 0) {

                return errorHandler(
                    res, 
                    false, 
                    404, 
                    "Course tidak ditemukan")
            }
            
            const deletedCourse = await courseModel.deleteCourse(id)

            if (!deletedCourse.affectedRows) {

                return errorHandler(
                    res, 
                    false, 
                    404, 
                    "Course tidak ditemukan")}

            return successHandler(
                res, 
                true, 
                200, 
                "Course berhasil dihapus", course)

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

            if (!course || course.length === 0) {

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