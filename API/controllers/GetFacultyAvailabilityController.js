const { Faculty } = require("../models/Faculty"); // Import the FacultySchedule and Faculty models
const { FacultySchedule } = require("../models/FacultySchedule");
const { Op } = require("sequelize"); // Sequelize operators for complex queries
const moment = require("moment"); // For date manipulation

const GetFacultyAvailability = async (req, res) => {
  const { facultyId } = req.params;

  try {
    // Fetch the faculty details to get startDate and endDate
    const faculty = await Faculty.findOne({
      where: { id: facultyId },
      attributes: ["startDate", "endDate"], // Select only startDate and endDate
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: "Faculty not found.",
      });
    }

    const { startDate, endDate } = faculty;

    // Fetch the faculty's availability schedule
    const availability = await FacultySchedule.findAll({
      where: {
        facultyId: facultyId,
        isActive: 1, // Assuming only active schedules are considered
      },
      order: [
        ["weekday", "ASC"],
        ["startTime", "ASC"],
      ],
    });

    if (!availability.length) {
      return res.status(404).json({
        success: false,
        message: "No availability found for the given faculty.",
      });
    }

    // Generate the availability dates within the startDate and endDate range
    const start = moment(startDate);
    const end = moment(endDate);
    const result = [];

    // Iterate through each day in the given date range
    for (let day = start; day.isSameOrBefore(end); day.add(1, "day")) {
      const weekday = day.format("dddd"); // Get the weekday name (e.g., Monday)

      // Check if the faculty is available on this weekday
      const dayAvailability = availability.filter(
        (slot) => slot.weekday === weekday
      );

      if (dayAvailability.length) {
        dayAvailability.forEach((slot) => {
          result.push({
            date: day.format("YYYY-MM-DD"), // The date of this availability
            weekday: slot.weekday,
            startTime: slot.startTime,
            endTime: slot.endTime,
          });
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  GetFacultyAvailability,
};
