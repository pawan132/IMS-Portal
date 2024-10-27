const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Branch = require("./Branch");
const Address = require("./Address");
const User = require("./User");
const Batch = require("./Batch");
const StudentBatchMapping = require("./StudentBatchMapping");
const Parent = require("./Parent");
const Course = require("./Course");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    admissionNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    branchId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    batchId: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    addressId: {
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
    tableName: "Students",
    timestamps: false,
    underscored: false,
    createdAt: "createdAt",
    updatedAt: "modifiedAt",
  }
);

Student.belongsTo(Branch, { foreignKey: "branchId" });
Student.belongsTo(Course, { foreignKey: "courseId" });
Student.belongsTo(Batch, { foreignKey: "batchId" });
Student.belongsTo(Address, { foreignKey: "addressId" });
Student.belongsTo(User, { foreignKey: "userId", as: "User" });
Student.belongsTo(User, { foreignKey: "createdBy", as: "Creator" });
Student.belongsTo(User, { foreignKey: "modifiedBy", as: "Modifier" });

User.hasMany(Student, { foreignKey: "userId", as: "Students" });
Branch.hasMany(Student, { foreignKey: "branchId" });

// Student.hasMany(Parent, { foreignKey: "studentId", as: "Parents" });
// Parent.belongsTo(Student, { foreignKey: "studentId" });

// Student.belongsToMany(Parent, { through: 'StudentParents', as: 'Parents' });

// Direct association between Student and Parent
Student.hasMany(Parent, { foreignKey: "studentId", as: "Parents" });
Parent.belongsTo(Student, { foreignKey: "studentId" });

// // Many-to-Many association between Student and Parent through StudentParents join table
// Student.belongsToMany(Parent, { through: 'StudentParents', as: 'ManyToManyParents' });
// Parent.belongsToMany(Student, { through: 'StudentParents', as: 'ManyToManyStudents' });


Student.belongsToMany(Batch, { through: StudentBatchMapping, foreignKey: "studentId", as: "Batches" });
Batch.belongsToMany(Student, { through: StudentBatchMapping, foreignKey: "batchId", as: "Students" });


module.exports = Student;
