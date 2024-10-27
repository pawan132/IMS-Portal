const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Course = require("./Course");
const Module = require("./Module");

const CourseModuleMapping = sequelize.define(
  "CourseModuleMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    courseId: {
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
    tableName: "CourseModuleMapping",
    timestamps: false, 
    createdAt: "createdAt", 
    updatedAt: "modifiedAt",
  }
);

CourseModuleMapping.belongsTo(Course, { foreignKey: "courseId" });
CourseModuleMapping.belongsTo(Module, { foreignKey: "moduleId" });

Course.belongsToMany(Module, { through: CourseModuleMapping, foreignKey: 'courseId' });
Module.belongsToMany(Course, { through: CourseModuleMapping, foreignKey: 'moduleId' });


module.exports = CourseModuleMapping;
