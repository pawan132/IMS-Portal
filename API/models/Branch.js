const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Institute = require("./Institute");
const Address = require("./Address");

const Branch = sequelize.define(
  "Branch",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    instituteId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    createdBy: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
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
    tableName: "Branch",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Branch.belongsTo(Institute, { foreignKey: "instituteId" });
Branch.belongsTo(Address, { foreignKey: "addressId" });

module.exports = Branch;
