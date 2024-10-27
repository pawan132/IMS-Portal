const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Institute = require("./Institute");
const Branch = require("./Branch");

const EnrollmentCourse = sequelize.define(
  "EnrollmentCourse",
  {
    enrolCourseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    stdId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    enrollDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cancellationReason: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "EnrollmentCourses",
    timestamps: true,
    underscored: false,
  }
);

// EnrollmentCourse.belongsTo(Institute, {
//   foreignKey: "instituteId",
//   targetKey: "instituteId",
// });
// EnrollmentCourse.belongsTo(Branch, {
//   foreignKey: "branchId",
//   targetKey: "branchId",
// });

module.exports = EnrollmentCourse;
