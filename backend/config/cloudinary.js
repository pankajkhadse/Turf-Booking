import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// storage config — images go to a 'turfs' folder on cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder:         'turfbook/turfs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
    }
})

// multer middleware — max 4 files, max 5MB each
export const uploadTurfPhotos = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only jpg, png and webp images are allowed'))
        }
    }
}).array('photos', 4)  // field name = 'photos', max 4 files

export { cloudinary }
