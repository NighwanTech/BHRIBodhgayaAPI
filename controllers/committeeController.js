const { Committee } = require('../models');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Helper function to delete old PDF
const deleteOldPdf = (pdfUrl) => {
    if (pdfUrl) {
        // e.g. /uploads/committees/filename.pdf
        const filePath = path.join(__dirname, '..', pdfUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// GET /api/committees
exports.getAll = async (req, res) => {
    try {
        const committees = await Committee.findAll({
            where: { isActive: true },
            order: [['name', 'ASC']],
        });
        res.json({ success: true, data: committees });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/committees/admin/all
exports.getAllAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', isActive } = req.query;
        
        let whereClause = {};
        
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }
        
        if (isActive !== undefined && isActive !== '') {
            whereClause.isActive = isActive === 'true';
        }

        const queryOptions = {
            where: whereClause,
            order: [['createdAt', 'DESC']],
        };

        if (parseInt(limit) !== 0) {
            queryOptions.limit = parseInt(limit);
            queryOptions.offset = (parseInt(page) - 1) * parseInt(limit);
        }

        const committees = await Committee.findAndCountAll(queryOptions);

        res.json({
            success: true,
            data: committees.rows,
            total: committees.count,
            page: parseInt(page),
            totalPages: parseInt(limit) === 0 ? 1 : Math.ceil(committees.count / parseInt(limit)),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/committees
exports.create = async (req, res) => {
    try {
        const { name, isActive } = req.body;
        
        let pdfUrl = null;
        if (req.file) {
            pdfUrl = `/uploads/committees/${req.file.filename}`;
        }

        const committee = await Committee.create({
            name,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
            pdfUrl
        });

        res.status(201).json({ success: true, data: committee, message: 'Committee created successfully' });
    } catch (error) {
        if (req.file) {
            // Delete uploaded file if DB operation fails
            deleteOldPdf(`/uploads/committees/${req.file.filename}`);
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/committees/:id
exports.update = async (req, res) => {
    try {
        const committee = await Committee.findByPk(req.params.id);
        if (!committee) {
            if (req.file) deleteOldPdf(`/uploads/committees/${req.file.filename}`);
            return res.status(404).json({ success: false, message: 'Committee not found' });
        }

        const { name, isActive } = req.body;
        
        if (name !== undefined) committee.name = name;
        if (isActive !== undefined) committee.isActive = isActive === 'true' || isActive === true;

        if (req.file) {
            // Remove old file
            deleteOldPdf(committee.pdfUrl);
            // Set new file URL
            committee.pdfUrl = `/uploads/committees/${req.file.filename}`;
        }

        await committee.save();
        res.json({ success: true, data: committee, message: 'Committee updated successfully' });
    } catch (error) {
        if (req.file) {
            deleteOldPdf(`/uploads/committees/${req.file.filename}`);
        }
        res.status(400).json({ success: false, message: error.message });
    }
};

// PATCH /api/committees/:id/toggle-status
exports.toggleStatus = async (req, res) => {
    try {
        const committee = await Committee.findByPk(req.params.id);
        if (!committee) {
            return res.status(404).json({ success: false, message: 'Committee not found' });
        }

        committee.isActive = !committee.isActive;
        await committee.save();

        res.json({ success: true, data: committee, message: 'Committee status toggled' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/committees/:id/permanent
exports.hardDelete = async (req, res) => {
    try {
        const committee = await Committee.findByPk(req.params.id);
        if (!committee) {
            return res.status(404).json({ success: false, message: 'Committee not found' });
        }

        // Remove PDF from disk
        deleteOldPdf(committee.pdfUrl);
        
        await committee.destroy();
        res.json({ success: true, message: 'Committee permanently deleted' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
