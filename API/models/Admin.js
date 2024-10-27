const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Institute = require("./Institute");
const Branch = require("./Branch");

const Admin = sequelize.define(
  "Admin",
  {
    adminId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
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
    tableName: "Admin",
    timestamps: true,
    underscored: false,
  }
);

// Admin.belongsTo(Branch, { foreignKey: "branchId", targetKey: "branchId" });
// Admin.belongsTo(Institute, { foreignKey: "instituteId", targetKey: "instituteId" });

module.exports = Admin;
