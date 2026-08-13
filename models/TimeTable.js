const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TimeTable = sequelize.define('TimeTable', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    programme: {
        // e.g. "MBBS", "MD", "MS"
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'MBBS',
    },
    year: {
        // e.g. "1st Year", "2nd Year", "Final Year"
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    semester: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    session: {
        // e.g. "2024-25"
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    pdfFile: {
        // path to uploaded PDF e.g. /uploads/timetable/file.pdf
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    imageFile: {
        // path to uploaded image e.g. /uploads/timetable/img.jpg
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
    tableName: 'time_tables',
});

module.exports = TimeTable;
