const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Student = require("./Student");
const Batch = require("./Batch");

const StudentBatchMapping = sequelize.define(
  "StudentBatchMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
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
    tableName: "StudentBatchMapping",
    timestamps: false, 
    createdAt: "createdAt", 
    updatedAt: "modifiedAt",
  }
);

StudentBatchMapping.belongsTo(Batch, { foreignKey: "batchId" });

module.exports = StudentBatchMapping;
