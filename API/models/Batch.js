const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Course = require("./Course");
const Branch = require("./Branch");
const FacultyBatchMapping = require("./FacultyBatchMapping");
const Faculty = require("./Faculty");

const Batch = sequelize.define(
  "Batch",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
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
      defaultValue: 0
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
    tableName: "Batch",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Batch.belongsTo(Branch, { foreignKey: "branchId"});
Batch.belongsTo(Course, { foreignKey: "courseId"});
Batch.belongsToMany(Faculty, { through: FacultyBatchMapping, foreignKey: 'batchId' });

module.exports = Batch;
