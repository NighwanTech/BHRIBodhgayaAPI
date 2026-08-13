const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const GalleryVideo = sequelize.define('GalleryVideo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    videoId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'YouTube Video ID'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'gallery_videos',
    timestamps: true,
});

module.exports = GalleryVideo;
