const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Course = require("./Course");
const Batch = require("./Batch");
const Branch = require("./Branch");
const FacultyBatchMapping = require("./FacultyBatchMapping");
const Faculty = require("./Faculty");

const BatchCalendar = sequelize.define(
  "BatchCalendar",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    startDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "BatchCalendar",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

BatchCalendar.belongsTo(Batch, { foreignKey: "batchId"});

// BatchCalendar.belongsTo(Branch, { foreignKey: "batchId"});

// BatchCalendar.belongsToMany(Faculty, {through:FacultyBatchMapping, foreignKey: 'batchId' });

module.exports = BatchCalendar;
