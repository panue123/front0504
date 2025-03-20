const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file tạm thời trước khi đẩy lên Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Lưu file tạm vào thư mục uploads
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;
