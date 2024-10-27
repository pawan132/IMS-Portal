const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Branch = require("./Branch");
const Role = require("./Role");

const User = sequelize.define(
  "Users",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.BIGINT,
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
    ipAddr: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
    browserInfo: {
      type: DataTypes.STRING,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
    createdAt: "createdAt", 
    updatedAt: "modifiedAt", 
  }
);

User.belongsTo(User, { foreignKey: "createdBy" });
User.belongsTo(User, { foreignKey: "modifiedBy" });
User.belongsTo(Branch, { foreignKey: "branchId" });
User.belongsTo(Role, { foreignKey: "roleId" });

module.exports = User;
