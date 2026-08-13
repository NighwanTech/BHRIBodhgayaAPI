const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/feeStructureController');
const { protect } = require('../middleware/authMiddleware');

// Upload dir setup
const uploadDir = path.join(__dirname, '..', 'uploads', 'fees');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        cb(null, `fees-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /pdf/;
        const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
        if (validExt) return cb(null, true);
        cb(new Error('Only PDF files are allowed'));
    },
});

const handleUpload = (req, res, next) => {
    upload.fields([{ name: 'pdfFile', maxCount: 1 }])(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        next();
    });
};

// PUBLIC
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// ADMIN
router.get('/admin/all', protect, controller.getAllAdmin);
router.post('/', protect, handleUpload, controller.create);
router.put('/:id', protect, handleUpload, controller.update);
router.patch('/:id/toggle-status', protect, controller.toggleStatus);
router.delete('/:id', protect, controller.remove);

module.exports = router;
