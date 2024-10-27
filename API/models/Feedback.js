const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Institute = require("./Institute");
const Branch = require("./Branch");

const Feedback = sequelize.define(
  "Feedback",
  {
    feedbackId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    feedback: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    stdId: {
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
    tableName: "Feedbacks",
    timestamps: true,
    underscored: false,
  }
);

// Feedback.belongsTo(Branch, { foreignKey: "branchId", targetKey: "branchId" });
// Feedback.belongsTo(Institute, {
//   foreignKey: "instituteId",
//   targetKey: "instituteId",
// });

module.exports = Feedback;
