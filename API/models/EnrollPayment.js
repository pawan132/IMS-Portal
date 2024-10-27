const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Institute = require("./Institute");
const Branch = require("./Branch");

const EnrollPayment = sequelize.define(
  "EnrollPayment",
  {
    enrollPayId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    enrollCourseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // instituteId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: Institute,
    //     key: "instituteId",
    //   },
    // },
    // branchId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: Branch,
    //     key: "branchId",
    //   },
    // },
  },
  {
    tableName: "EnrollPayments",
    timestamps: true,
    underscored: false,
  }
);

// EnrollPayment.belongsTo(Branch, {
//   foreignKey: "branchId",
//   targetKey: "branchId",
// });

// EnrollPayment.belongsTo(Institute, {
//   foreignKey: "instituteId",
//   targetKey: "instituteId",
// });

module.exports = EnrollPayment;
