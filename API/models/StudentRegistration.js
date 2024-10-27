const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database"); // Assuming you have a sequelize instance in config/database.js

const StudentRegistration = sequelize.define(
  "StudentRegistration",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true, // Validates email format
      },
    },
    mobileno: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        len: [10, 15], // Validates length to be between 10 and 15
      },
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "studentRegistration",
    timestamps: false, // Disabling the default `createdAt` and `updatedAt` since we already defined custom fields
  }
);

module.exports = StudentRegistration;
