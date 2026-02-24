const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Image storage
const imageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'marketplace/posts',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 900, crop: 'limit', quality: 'auto' }],
    },
});

// Avatar storage
const avatarStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'marketplace/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }],
    },
});

// Video storage
const videoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'marketplace/videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'mov', 'avi', 'mkv'],
    },
});

// Banner storage
const bannerStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'marketplace/banners',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1920, height: 600, crop: 'fill', quality: 'auto' }],
    },
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

exports.uploadImages = multer({ storage: imageStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
exports.uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
exports.uploadVideo = multer({ storage: videoStorage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } });
exports.uploadBanner = multer({ storage: bannerStorage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
exports.cloudinary = cloudinary;
