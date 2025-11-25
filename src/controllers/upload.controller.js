const upload = require("../services/upload.service");
const { successHandler, errorHandler } = require("../utils/helper.responses");
const supabase = require("../config/supabase");
const path = require("path");

const uploadFile = async (req, res) => {
    try {
        upload.single("file")(req, res, async (err) => {
            if (err) {
                return errorHandler(res, false, 400, err.message);
            }

            if (!req.file) {
                return errorHandler(res, false, 400, "Tidak ada file yang diupload");
            }

            const ext = path.extname(req.file.originalname);
            const filename = `file-${Date.now()}${ext}`;

            // Upload buffer ke Supabase Storage
            const { data, error } = await supabase.storage
                .from("uploads")
                .upload(`images/${filename}`, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false,
                });

            if (error) {
                return errorHandler(res, false, 500, error.message);
            }

            // Generate public URL
            const { data: publicUrl } = supabase.storage
                .from("uploads")
                .getPublicUrl(`images/${filename}`);

            return successHandler(res, true, 200, "File berhasil diupload", {
                filename,
                url: publicUrl.publicUrl,
            });
        });
    } catch (error) {
        return errorHandler(res, false, 500, error.message);
    }
};

module.exports = { uploadFile };