const Batch = require("../models/Batch");
const Branch = require("../models/Branch");
const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const Attendance = require("../models/StudentAttendance");
const User = require("../models/User");

const createAttendance = async (req, res, next) => {
  const { branchId, studentId, batchId, facultyId, status, date, reason } =
    req.body;

  try {
    const attendance = await Attendance.create({
      studentId,
      batchId,
      facultyId,
      status,
      date,
      reason,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAttendanceById = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findByPk(id, {
      include: [
        {
          model: Branch,
        },
        {
          model: Faculty,
        },
        {
          model: Student,
          include: { model: User },
        },
        {
          model: Batch,
        },
      ],
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAttendanceByBranchId = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: [
        {
          model: Branch, where: { id: req.user?.branchId }
        },
        {
          model: Faculty,
        },
        {
          model: Student,
          include: { model: User },
        },
        {
          model: Batch,
        },
      ],
    });

    if (!attendances) {
      return res.status(400).json({
        success: false,
        message: "Attendances not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendances,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAttendanceByCustomBranchId = async (req, res) => {
  const { id } = req.params;
  try {
    const attendances = await Attendance.findAll({
      where: { branchId: id },
    });

    if (!attendances) {
      return res.status(400).json({
        success: false,
        message: "Attendances not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendances,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAttendanceByInstituteId = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: { model: Branch, where: { instituteId: req.user?.instituteId } },
    });

    if (!attendances) {
      return res.status(400).json({
        success: false,
        message: "Attendances not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: attendances,
      message: "Attendance fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId } = req.body;
  try {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await attendance.update({
      name,
      description,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteAttendance = async (req, res, next) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await attendance.destroy();

    return res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.findAll({
      include: {
        model: Branch,
      },
    });

    return res.status(200).json({
      success: true,
      data: attendances,
      message: "Attendances fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleAttendance = async (req, res) => {
  const { id } = req.params;
  try {
    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance not found",
      });
    }

    await attendance.update({
      isActive: !attendance.isActive,
    });

    return res.status(200).json({
      success: true,
      data: attendance,
      message: "Attendance toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

attendance.exports = {
  createAttendance,
  getAttendanceByBranchId,
  updateAttendance,
  deleteAttendance,
  getAllAttendances,
  toggleAttendance,
  getAttendanceById,
  getAttendanceByInstituteId,
  getAttendanceByCustomBranchId,
  createAttendanceAdmin,
};
