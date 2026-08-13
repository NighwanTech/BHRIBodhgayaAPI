const { FeeStructure } = require('../models');
const { Op } = require('sequelize');

// GET ALL (Public)
const getAll = async (req, res) => {
    try {
        const where = { isActive: true };
        const { programme, quota } = req.query;
        if (programme) where.programme = { [Op.like]: `%${programme}%` };
        if (quota) where.quota = { [Op.like]: `%${quota}%` };

        const data = await FeeStructure.findAll({
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
        const data = await FeeStructure.findAll({
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
        const item = await FeeStructure.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// CREATE
const create = async (req, res) => {
    try {
        const { programme, quota, year, session, tuitionFee, hostelFee, developmentFee, cautionDeposit, otherFee, totalFee, notes, displayOrder, isActive } = req.body;
        if (!programme || !quota) {
            return res.status(400).json({ success: false, message: 'Required: programme, quota' });
        }

        const files = req.files || {};
        const pdfFile = files.pdfFile ? `/uploads/fees/${files.pdfFile[0].filename}` : null;

        const item = await FeeStructure.create({
            programme, quota,
            year: year || '1st Year',
            session: session || null,
            tuitionFee: tuitionFee || null,
            hostelFee: hostelFee || null,
            developmentFee: developmentFee || null,
            cautionDeposit: cautionDeposit || null,
            otherFee: otherFee || null,
            totalFee: totalFee || null,
            notes: notes || null,
            pdfFile,
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
        const item = await FeeStructure.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });

        const { programme, quota, year, session, tuitionFee, hostelFee, developmentFee, cautionDeposit, otherFee, totalFee, notes, displayOrder, isActive } = req.body;
        const files = req.files || {};

        const updateData = {};
        if (programme !== undefined) updateData.programme = programme;
        if (quota !== undefined) updateData.quota = quota;
        if (year !== undefined) updateData.year = year;
        if (session !== undefined) updateData.session = session;
        if (tuitionFee !== undefined) updateData.tuitionFee = tuitionFee;
        if (hostelFee !== undefined) updateData.hostelFee = hostelFee;
        if (developmentFee !== undefined) updateData.developmentFee = developmentFee;
        if (cautionDeposit !== undefined) updateData.cautionDeposit = cautionDeposit;
        if (otherFee !== undefined) updateData.otherFee = otherFee;
        if (totalFee !== undefined) updateData.totalFee = totalFee;
        if (notes !== undefined) updateData.notes = notes;
        if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
        if (isActive !== undefined) updateData.isActive = isActive === 'true' || isActive === true;
        if (files.pdfFile) updateData.pdfFile = `/uploads/fees/${files.pdfFile[0].filename}`;

        await item.update(updateData);
        res.json({ success: true, message: 'Updated', data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

// DELETE
const remove = async (req, res) => {
    try {
        const item = await FeeStructure.findByPk(req.params.id);
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
        const item = await FeeStructure.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        await item.update({ isActive: !item.isActive });
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
};

module.exports = { getAll, getAllAdmin, getById, create, update, remove, toggleStatus };
