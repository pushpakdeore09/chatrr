import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../services/cloudinary.service.js";
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "chatrr",
            resource_type: "auto",
            public_id: `${Date.now()}-${file.originalname}`,
        }
    }
});

const fileUpload = multer({ storage });
export default fileUpload;