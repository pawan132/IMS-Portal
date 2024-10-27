const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Student = require("./Student");

const Payment = sequelize.define(
  "Payments",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    admissionNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    baseFees: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scholarship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grossFees: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tax: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    netFees: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isOneTime: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receiveDate: {
      type: DataTypes.DATE,
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
    tableName: "Payments",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Payment.belongsTo(Student, { foreignKey: "studentId" });

module.exports = Payment;
