const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Batch = require("./Batch");
const Faculty = require("./Faculty");

const FacultyBatchMapping = sequelize.define(
  "FacultyBatchMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    facultyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "FacultyBatchMapping",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

FacultyBatchMapping.belongsTo(Faculty, { foreignKey: "facultyId" });

module.exports = FacultyBatchMapping;