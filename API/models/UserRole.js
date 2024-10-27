const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const User = require("./User");
const Role = require("./Role");
const Branch = require("./Branch");

const UserRole = sequelize.define(
  "UserRoleMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    roleId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    branchId: {
      type: DataTypes.BIGINT,
      allowNull: true
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
    tableName: "UserRoleMapping",
    timestamps: false, // Disable automatic timestamps
    createdAt: "createdAt", // Use createdAt column for the created timestamp
    updatedAt: "modifiedAt", // Use modifiedAt column for the updated timestamp
  }
);

UserRole.belongsTo(User, { foreignKey: "createdBy" });
UserRole.belongsTo(User, { foreignKey: "modifiedBy" });
UserRole.belongsTo(User, { foreignKey: "userId" });
UserRole.belongsTo(Role, { foreignKey: "roleId" });
UserRole.belongsTo(Branch, { foreignKey: "branchId" });

module.exports = UserRole;
