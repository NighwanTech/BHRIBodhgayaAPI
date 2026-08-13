const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FeeStructure = sequelize.define('FeeStructure', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    programme: {
        // e.g. "MBBS", "MD", "MS"
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    quota: {
        // e.g. "State Government Quota", "Management Quota", "NRI/International Quota"
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    year: {
        // e.g. "1st Year", "2nd Year", "All Years"
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: '1st Year',
    },
    session: {
        // e.g. "2024-25"
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    tuitionFee: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    hostelFee: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    developmentFee: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    cautionDeposit: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    otherFee: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    totalFee: {
        type: DataTypes.STRING(200),
        allowNull: true,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    pdfFile: {
        // optional uploaded PDF
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    displayOrder: {
        type: DataTypes.INTEGER,
        defaultValue: 999,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'fee_structures',
});

module.exports = FeeStructure;
