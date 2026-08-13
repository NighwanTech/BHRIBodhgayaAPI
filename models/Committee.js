const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Committee = sequelize.define('Committee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pdfUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'committees',
    timestamps: true,
});

module.exports = Committee;
