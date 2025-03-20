const cloudinary = require('cloudinary').v2;
require('dotenv').config();
console.log("Cloudinary Config:", process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "products" // Đảm bảo ảnh được lưu vào thư mục "products"
        });
        console.log("Ảnh đã upload:", result.secure_url);
        return result.secure_url; // Trả về URL của ảnh
    } catch (error) {
        console.error("❌ Lỗi khi upload ảnh:", error);
        return null;
    }
};

module.exports = cloudinary;
