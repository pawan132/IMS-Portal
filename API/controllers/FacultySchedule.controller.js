const FacultySchedule = require('../models/FacultySchedule');

const createFacultyAvailability = async (req, res) => {
  const { facultyId, availability } = req.body; // facultyId is passed in the request, and availability is an array of availability slots

  // Validate that facultyId is provided
  if (!facultyId) {
    return res.status(400).json({
      success: false,
      message: "Faculty ID is required",
    });
  }

  // Validate that availability is provided and is an array
  if (!availability || !Array.isArray(availability)) {
    return res.status(400).json({
      success: false,
      message: "Availability data is required and should be an array",
    });
  }

  try {
    // Iterate over each availability slot and create a new record
    for (const slot of availability) {
      const { weekday, startTime, endTime } = slot;

      // Validate required fields
      if (!weekday || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: "Incomplete availability data",
        });
      }

      // Create the faculty schedule record
      await FacultySchedule.create({
        faculty_id: facultyId,
        weekday,
        startTime,
        endTime,
        createdBy: req.user.id, // Assuming req.user.id is the ID of the user creating this record
        createdAt: new Date(),
        modifiedBy: req.user.id,
        modifiedAt: new Date(),
        isActive: 1, // Assuming default value for isActive is 1 (active)
      });
    }

    return res.status(200).json({
      success: true,
      message: "Faculty availability created successfully",
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

const GetFacultySchedule = async (req, res) => {
  const { facultyId } = req.query; // facultyId is passed in the request

  // Validate that facultyId is provided
  if (!facultyId) {
    return res.status(400).json({
      success: false,
      message: "Faculty ID is required",
    });
  }

  try {
    // Fetching the faculty schedule
    const data = await FacultySchedule.findAll({
      where: { facultyId },
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Faculty schedule fetched successfully",
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
  createFacultyAvailability,
  GetFacultySchedule
};

