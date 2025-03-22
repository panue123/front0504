const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: "de6bmgltb",
    api_key: "754479267675762",
    api_secret: "41I6Y_khYMFUdU0KVPkU1FsAUoE",
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Không có file ảnh nào được tải lên" });
        }
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        res.status(500).json({ message: "Lỗi khi upload ảnh", error });
    }
});

module.exports = router;