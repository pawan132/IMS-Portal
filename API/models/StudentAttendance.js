const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Student = require("./Student");
const Branch = require("./Branch");
const Batch = require("./Batch");
const BatchCalendar = require("./BatchCalendar");
const Faculty = require("./Faculty");

const StudentAttendance = sequelize.define(
  "StudentAttendance",
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
    studentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    facultyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
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
    tableName: "StudentAttendance",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

StudentAttendance.belongsTo(Student, { foreignKey: "studentId"})
StudentAttendance.belongsTo(Branch, { foreignKey: "branchId"})
// StudentAttendance.belongsTo(Batch, { foreignKey: "batchId"})
StudentAttendance.belongsTo(BatchCalendar, { foreignKey: "batchCalendarId"})
StudentAttendance.belongsTo(Faculty, { foreignKey: "facultyId"})

module.exports = StudentAttendance;
