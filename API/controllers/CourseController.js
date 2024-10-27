const Branch = require("../models/Branch");
const Course = require("../models/Course");
const Module = require("../models/Module");
const CourseModuleMapping = require("../models/CourseModuleMapping");

const createCourse = async (req, res, next) => {
  // console.log(req.body);
  const { name, description, branchId, moduleId, baseFees, tax, totalFees,booksFees,bookstax} = req.body;

  try {
    const course = await Course.create({
      name,
      description,
      branchId,
      baseFees,
      tax,
      totalFees,
      booksFees,
      booksGST:bookstax
    });

    if (moduleId && moduleId.length > 0) {
      await course.setModules(moduleId, {
        through: { createdBy: req.user.id },
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const createCourseAdmin = async (req, res, next) => {
  // console.log(req.body);
  const { name, description, branchId, moduleId, baseFees, tax, totalFees } = req.body;

  try {
    if (Array.isArray(branchId)) {
      for (const id of branchId) {
        const course = await Course.create({
          name,
          description,
          branchId: id,
          baseFees,
          tax,
          totalFees
        });

        if (moduleId && moduleId.length > 0) {
          await course.setModules(moduleId, {
            through: { createdBy: req.user.id },
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id, {
      include: {
        model: Branch,
      },
    });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getCourseByBranchId = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Branch,
          where: { id: req.user?.branchId },
        },
        {
          model: Module,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!courses.length) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getCourseByCustomBranchId = async (req, res) => {
  const { branchId } = req.params;
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Branch,
          where: { id: branchId },
        },
        {
          model: Module,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!courses.length) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getCourseByInstituteId = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Branch,
          where: { instituteId: req.user?.instituteId },
        },
        {
          model: Module,
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Course fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId, moduleId, baseFees, tax, totalFees ,booksFees,bookstax} = req.body;
  console.log(req.body);
  try {
    const course = await Course.findByPk(id, {
      include: [{ model: Module, as: "Modules" }],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Update course details
    await course.update({
      name,
      description,
      branchId,
      baseFees, 
      tax, 
      totalFees,
      booksFees,
      booksGST:bookstax
    });

    if (moduleId && moduleId.length > 0) {
      // Get current modules associated with the course
      const currentModules = course.Modules.map((module) => module.id);

      // Determine modules to add and remove
      const modulesToAdd = moduleId.filter(
        (id) => !currentModules.includes(id)
      );
      const modulesToRemove = currentModules.filter(
        (id) => !moduleId.includes(id)
      );

      // Add new modules
      if (modulesToAdd.length > 0) {
        await course.addModules(modulesToAdd, {
          through: { createdBy: req.user.id },
        });
      }

      // Remove old modules
      if (modulesToRemove.length > 0) {
        await course.removeModules(modulesToRemove);
      }
    } else {
      // Remove all modules if no moduleId is provided
      await course.removeModules(course.Modules.map((module) => module.id));
    }

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res, next) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.destroy();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: Branch,
      },
    });

    return res.status(200).json({
      success: true,
      data: courses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    await course.update({
      isActive: !course.isActive,
    });

    return res.status(200).json({
      success: true,
      data: course,
      message: "Course toggled successfully",
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
  createCourse,
  getCourseByBranchId,
  updateCourse,
  deleteCourse,
  getAllCourses,
  toggleCourse,
  getCourseById,
  getCourseByInstituteId,
  createCourseAdmin,
  getCourseByCustomBranchId
};
