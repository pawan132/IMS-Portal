const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Faculty = require('./Faculty');

const FacultySchedule = sequelize.define(
  'FacultySchedule',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    facultyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Faculty,
        key: 'id',
      },
    },
    day: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    modifiedBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    modifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: 'FacultySchedule',
    timestamps: false,
  }
);


Faculty.hasMany(FacultySchedule, { foreignKey: 'facultyId' });
FacultySchedule.belongsTo(Faculty, { foreignKey: 'facultyId' });

module.exports = FacultySchedule;


