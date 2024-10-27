const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Address = require("./Address");

const Institute = sequelize.define(
  "Institute",
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
    addressId: {
      type: DataTypes.BIGINT,
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
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    establishedYear: {
      type: DataTypes.BIGINT,
      allowNull: true,
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
    tableName: "Institute",
    timestamps: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Institute.belongsTo(Address, { foreignKey: "addressId" });

module.exports = Institute;
