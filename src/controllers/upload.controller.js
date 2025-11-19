const upload = require("../services/upload.service");
const { successHandler, errorHandler } = require("../utils/helper.responses");

const uploadFile = async (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return errorHandler(res, false, 400, err.message);
    }

    if (!req.file) {
      return errorHandler(res, false, 400, "Tidak ada file yang diupload");
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return successHandler(res, true, 200, "File berhasil diupload", {
      filename: req.file.filename,
      path: fileUrl,
    });
  });
};

module.exports = { uploadFile };
