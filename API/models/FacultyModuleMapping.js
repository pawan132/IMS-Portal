const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Module = require("./Module");
const Faculty = require("./Faculty");

const FacultyModuleMapping = sequelize.define(
  "FacultyModuleMapping",
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
    moduleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 1,
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
    tableName: "FacultyModuleMapping",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

FacultyModuleMapping.belongsTo(Faculty, { foreignKey: "facultyId" });
FacultyModuleMapping.belongsTo(Module, { foreignKey: "moduleId" });

Faculty.belongsToMany(Module, { through: FacultyModuleMapping, foreignKey: 'facultyId' });
Module.belongsToMany(Faculty, { through: FacultyModuleMapping, foreignKey: 'moduleId' });

module.exports = FacultyModuleMapping;
