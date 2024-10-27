const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Branch = require("./Branch");
const Faculty = require("./Faculty");

const Module = sequelize.define(
  "Modules",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    branchId: {
      type: DataTypes.INTEGER,
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
    tableName: "Modules",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Module.belongsTo(Branch, { foreignKey: "branchId" });

module.exports = Module;