const Student = require("../models/Student");
const Branch = require("../models/Branch");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const Faculty = require("../models/Faculty");

const getDashboardCardsByInstitute = async (req, res) => {
  const { instituteId } = req.user;
  try {
    const branch = await Branch.findAll({
      where: { instituteId },
    });
    const students = await Student.findAll({
      include: [
        {
          model: Branch,
          where: { instituteId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const courses = await Course.findAll({
      include: [
        {
          model: Branch,
          where: { instituteId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const faculty = await Faculty.findAll({
      include: [
        {
          model: Branch,
          where: { instituteId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const batch = await Batch.findAll({
      include: [
        {
          model: Branch,
          where: { instituteId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });

    const dashboard = {
        branch,
        students,
        courses,
        faculty,
        batch
    }

    return res.status(200).json({
      success: true,
      data: dashboard,
      message: "Dashboard fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getDashboardCardsByBranch = async (req, res) => {
  const { branchId } = req.user;
  try {
    const branch = await Branch.findAll({
      where: { id: branchId },
    });
    const students = await Student.findAll({
      include: [
        {
          model: Branch,
          where: { id: branchId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const courses = await Course.findAll({
      include: [
        {
          model: Branch,
          where: { id: branchId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const faculty = await Faculty.findAll({
      include: [
        {
          model: Branch,
          where: { id: branchId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });
    const batch = await Batch.findAll({
      include: [
        {
          model: Branch,
          where: { id: branchId },
          attributes: [], // Exclude branch attributes from the result
        },
      ],
    });

    const dashboard = {
        branch,
        students,
        courses,
        faculty,
        batch
    }

    return res.status(200).json({
      success: true,
      data: dashboard,
      message: "Dashboard fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardCardsByInstitute,
  getDashboardCardsByBranch
}