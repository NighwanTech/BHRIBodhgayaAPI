const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const controller = require('../controllers/galleryVideoController');
const { galleryVideoValidation } = require('../validations/galleryVideo.validation');

// GET /api/gallery-videos (Public - active videos)
router.get('/', controller.getAllVideos);

// GET /api/gallery-videos/admin/all (Admin - all videos with pagination)
router.get('/admin/all', protect, controller.getAdminVideos);

// POST /api/gallery-videos
router.post('/', protect, validate(galleryVideoValidation.create), controller.createVideo);

// PUT /api/gallery-videos/:id
router.put('/:id', protect, validate(galleryVideoValidation.update), controller.updateVideo);

// PATCH /api/gallery-videos/:id/toggle-status
router.patch('/:id/toggle-status', protect, controller.toggleStatus);

// DELETE /api/gallery-videos/:id
router.delete('/:id', protect, controller.deleteVideo);

module.exports = router;
