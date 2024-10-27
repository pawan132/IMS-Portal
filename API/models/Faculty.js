const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Branch = require("./Branch");
const User = require("./User");
const Address = require("./Address");
const Module = require("./Module");

const Faculty = sequelize.define(
  "Faculty",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 1,
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
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    tableName: "Faculty",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

// Associations
Faculty.belongsTo(Branch, { foreignKey: "branchId" });
Faculty.belongsTo(Address, { foreignKey: "addressId" });
Faculty.belongsTo(User, { foreignKey: "userId", as: "User" });
Faculty.belongsTo(User, { foreignKey: "createdBy", as: "Creator" });
Faculty.belongsTo(User, { foreignKey: "modifiedBy", as: "Modifier" });

User.hasMany(Faculty, { foreignKey: "userId", as: "Faculties" });
Branch.hasMany(Faculty, { foreignKey: "branchId" });

Faculty.belongsToMany(Module, { through: 'FacultyModuleMapping', as: 'Modules', foreignKey: 'facultyId' });
Module.belongsToMany(Faculty, { through: 'FacultyModuleMapping', as: 'Faculties', foreignKey: 'moduleId' });

module.exports = Faculty;