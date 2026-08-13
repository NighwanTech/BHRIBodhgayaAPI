const { TimeTable } = require('../models');
const { Op } = require('sequelize');

// GET ALL (Public)
const getAll = async (req, res) => {
    try {
        const where = { isActive: true };
        const { programme, year } = req.query;
        if (programme) where.programme = { [Op.like]: `%${programme}%` };
        if (year) where.year = { [Op.like]: `%${year}%` };

        const data = await TimeTable.findAll({
            where,
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
        });
        res.json({ success: true, total: data.length, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// GET ALL ADMIN
const getAllAdmin = async (req, res) => {
    try {
        const data = await TimeTable.findAll({
            order: [['displayOrder', 'ASC'], ['createdAt', 'DESC']],
        });
        res.json({ success: true, total: data.length, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// GET BY ID
const getById = async (req, res) => {
    try {
        const item = await TimeTable.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// CREATE
const create = async (req, res) => {
    try {
        const { title, programme, year, semester, session, displayOrder, isActive } = req.body;
        if (!title || !programme || !year) {
            return res.status(400).json({ success: false, message: 'Required: title, programme, year' });
        }

        const files = req.files || {};
        const pdfFile = files.pdfFile ? `/uploads/timetable/${files.pdfFile[0].filename}` : null;
        const imageFile = files.imageFile ? `/uploads/timetable/${files.imageFile[0].filename}` : null;

        const item = await TimeTable.create({
            title, programme, year,
            semester: semester || null,
            session: session || null,
            pdfFile,
            imageFile,
            displayOrder: displayOrder ? parseInt(displayOrder) : 999,
            isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
        });
        res.status(201).json({ success: true, message: 'Created', data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// UPDATE
const update = async (req, res) => {
    try {
        const item = await TimeTable.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });

        const { title, programme, year, semester, session, displayOrder, isActive } = req.body;
        const files = req.files || {};

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (programme !== undefined) updateData.programme = programme;
        if (year !== undefined) updateData.year = year;
        if (semester !== undefined) updateData.semester = semester;
        if (session !== undefined) updateData.session = session;
        if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
        if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
        if (files.pdfFile) updateData.pdfFile = `/uploads/timetable/${files.pdfFile[0].filename}`;
        if (files.imageFile) updateData.imageFile = `/uploads/timetable/${files.imageFile[0].filename}`;

        await item.update(updateData);
        res.json({ success: true, message: 'Updated', data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// DELETE
const remove = async (req, res) => {
    try {
        const item = await TimeTable.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        await item.destroy();
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// TOGGLE isActive
const toggleStatus = async (req, res) => {
    try {
        const item = await TimeTable.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        await item.update({ isActive: !item.isActive });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = { getAll, getAllAdmin, getById, create, update, remove, toggleStatus };
