const { errorHandler } = require('../utils/helper.responses');

// roles: array of allowed roles (e.g. ['admin'])
const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    try {
      const userRole = req.user.role;

      if (!roles.includes(userRole)) {
        return errorHandler(res, false, 403, "Akses ditolak. Anda tidak memiliki izin.");
      }

      next();
    } catch (error) {
      return errorHandler(res, false, 500, `Internal Server Error: ${error.message}`);
    }
  };
};

module.exports = { authorizeRole };
