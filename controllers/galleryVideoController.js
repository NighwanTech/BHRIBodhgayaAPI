const { GalleryVideo } = require('../models');

// GET /api/gallery-videos (Public)
exports.getAllVideos = async (req, res) => {
    try {
        const videos = await GalleryVideo.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: videos });
    } catch (error) {
        console.error('Error fetching gallery videos:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// GET /api/gallery-videos/admin/all (Admin)
exports.getAdminVideos = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const queryOptions = {
            order: [['createdAt', 'DESC']]
        };

        if (parseInt(limit) > 0) {
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = offset;
        }

        const videos = await GalleryVideo.findAndCountAll(queryOptions);

        res.json({
            success: true,
            data: videos.rows,
            total: videos.count,
            totalPages: parseInt(limit) === 0 ? 1 : Math.ceil(videos.count / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching videos for admin:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /api/gallery-videos (Admin)
exports.createVideo = async (req, res) => {
    try {
        const { title, videoId, isActive } = req.body;
        
        const video = await GalleryVideo.create({
            title,
            videoId,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({ success: true, data: video, message: 'Video added successfully' });
    } catch (error) {
        console.error('Error creating video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// PUT /api/gallery-videos/:id (Admin)
exports.updateVideo = async (req, res) => {
    try {
        const { title, videoId, isActive } = req.body;
        
        const video = await GalleryVideo.findByPk(req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        if (title !== undefined) video.title = title;
        if (videoId !== undefined) video.videoId = videoId;
        if (isActive !== undefined) video.isActive = isActive === 'true' || isActive === true;

        await video.save();
        res.json({ success: true, data: video, message: 'Video updated successfully' });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// PATCH /api/gallery-videos/:id/toggle-status (Admin)
exports.toggleStatus = async (req, res) => {
    try {
        const video = await GalleryVideo.findByPk(req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        video.isActive = !video.isActive;
        await video.save();

        res.json({ success: true, data: video, message: 'Video status toggled' });
    } catch (error) {
        console.error('Error toggling video status:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// DELETE /api/gallery-videos/:id (Admin)
exports.deleteVideo = async (req, res) => {
    try {
        const video = await GalleryVideo.findByPk(req.params.id);
        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        await video.destroy();
        res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
