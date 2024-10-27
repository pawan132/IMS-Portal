const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const Faculty = require("./Faculty");
const FacultySchedule = require("./FacultySchedule");

const FacultyCalendar = sequelize.define(
  "FacultyCalendar",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    facultyId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: Faculty,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    FacultyScheduleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: FacultySchedule,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    day: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
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
    tableName: "facultyCalendar",
    timestamps: false,
  }
);

Faculty.hasMany(FacultyCalendar, { foreignKey: "facultyId" });
FacultySchedule.hasMany(FacultyCalendar, { foreignKey: "FacultyScheduleId" });
FacultyCalendar.belongsTo(Faculty, { foreignKey: "facultyId" });
FacultyCalendar.belongsTo(FacultySchedule, { foreignKey: "FacultyScheduleId" });

module.exports = FacultyCalendar;
