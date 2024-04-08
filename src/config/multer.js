const multer = require("multer");
const path = require("path");

// MySQL database connection
const pool = require('./mysqlPool');

// Image upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
         cb(null, path.join("./files/"));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

// Checking file type
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Multer configuration
exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6 // Limit file size to 6MB
    },
    fileFilter: fileFilter
});

// Middleware to handle file upload and save file details in MySQL
exports.uploadMiddleware = (req, res, next) => {
    exports.upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload error' });
        }
        // Save file details in MySQL
        const image = req.file;
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }
        const { originalname, mimetype, filename } = image;
        const sql = 'INSERT INTO files (originalname, mimetype, filename) VALUES (?, ?, ?)';
        pool.query(sql, [originalname, mimetype, filename], (err, result) => {
            if (err) {
                console.error('Failed to upload image:', err);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
            res.status(200).json({ message: 'Image uploaded successfully' });
        });
    });
};