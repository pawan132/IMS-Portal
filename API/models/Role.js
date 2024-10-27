const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");

const Role = sequelize.define(
  "RoleMaster",
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
    description: {
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
    tableName: 'RoleMaster',
    timestamps: false, // Disable automatic timestamps
    createdAt: "createdAt", // Use createdAt column for the created timestamp
    updatedAt: "modifiedAt", // Use modifiedAt column for the updated timestamp
  }
);

module.exports = Role;
