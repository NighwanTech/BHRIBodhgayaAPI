const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/committeeController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { committeeValidation } = require('../validations/committee.validation');

// ── PDF Upload Setup ──────────────────────────────────
const uploadDir = path.join(__dirname, '..', 'uploads', 'committees');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) =>
        cb(null, `committee-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = /pdf/;
        const validExt = allowed.test(path.extname(file.originalname).toLowerCase());
        const validMime = file.mimetype === 'application/pdf';
        
        if (validExt && validMime) return cb(null, true);
        cb(new Error('Only PDF files are allowed'));
    },
});

// Wrapper for error handling
const handleUpload = (req, res, next) => {
    upload.single('pdf')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

// ─────────────────────────────────────────────────────────
// PUBLIC ROUTES
// ─────────────────────────────────────────────────────────

// GET /api/committees
router.get('/', controller.getAll);

// ─────────────────────────────────────────────────────────
// ADMIN ROUTES (require Bearer token via protect middleware)
// ─────────────────────────────────────────────────────────

// GET /api/committees/admin/all
router.get('/admin/all', protect, controller.getAllAdmin);

// POST /api/committees
router.post('/', protect, handleUpload, validate(committeeValidation.create), controller.create);

// PUT /api/committees/:id
router.put('/:id', protect, handleUpload, validate(committeeValidation.update), controller.update);

// PATCH /api/committees/:id/toggle-status
router.patch('/:id/toggle-status', protect, controller.toggleStatus);

// DELETE /api/committees/:id/permanent
router.delete('/:id/permanent', protect, controller.hardDelete);

module.exports = router;
