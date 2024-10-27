const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Faculty = require('./Faculty');
const Branch = require("./Branch");
const BatchCalendar = require("./BatchCalendar");

const FacultyAttendance = sequelize.define(
  "FacultyAttendance",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    facultyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    batchCalendarId: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
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
    tableName: "FacultyAttendance",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

FacultyAttendance.belongsTo(Faculty, { foreignKey: "facultyId"})
FacultyAttendance.belongsTo(Branch, { foreignKey: "branchId"})
FacultyAttendance.belongsTo(BatchCalendar, { foreignKey: "batchCalendarId"})

module.exports = FacultyAttendance;
