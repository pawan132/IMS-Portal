const Branch = require("../models/Branch");
const Batch = require("../models/Batch");
const BatchCalendar = require("../models/BatchCalendar");
const Module = require("../models/Module");
const FacultyBatchMapping = require("../models/FacultyBatchMapping");
const Faculty = require("../models/Faculty");
const Course = require("../models/Course");
const User = require("../models/User");
const { Op } = require('sequelize');

const createBatch = async (req, res, next) => {
  // console.log(req.body);
  const { name, branchId, courseId, startDate, endDate, startTime, endTime, facultyId, modules } = req.body;

  try {
    const batch = await Batch.create({
      name,
      branchId,
      courseId,
      startDate,
      endDate,
      startTime,
      endTime
    });

    if (facultyId && facultyId.length > 0) {
      for (const faculty of facultyId) {
        await FacultyBatchMapping.create({
          facultyId: faculty,
          batchId: batch.id,
          createdBy: req.user.id
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: batch,
      message: "Batch created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBatchById = async (req, res) => {
  const { id } = req.params;
  try {
    const batch = await Batch.findByPk(id, {
      include: {
        model: Branch,
      },
    });

    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: batch,
      message: "Batch fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBatchByBranchId = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: [
        {
          model: Branch,
          where: { id: req.user?.branchId },
        },
        {
          model: Course,
        },
        {
          model: Faculty,
          through: { attributes: [] }, // Exclude join table attributes
          include: [
            {
              model: User,
              as: "User",
              attributes: ["id", "fullName"], // Assuming `name` is the column in User model
            },
          ],
        },
      ],
    });

    if (!batches.length) {
      return res.status(400).json({
        success: false,
        message: "Batches not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: batches,
      message: "Batches fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBatchByCourseId = async (req, res) => {
  const {courseId} = req.params;
  // console.log(courseId);
  try {
    const batches = await Batch.findAll({
      where: { courseId: courseId },
    });

    if (!batches.length) {
      return res.status(400).json({
        success: false,
        message: "Batches not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: batches,
      message: "Batches fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBatchByInstituteId = async (req, res) => {
  try {
    const { name, branch, facultyName } = req.query; // Add `facultyName` for filtering by faculty fullName

    const batches = await Batch.findAll({
      where: {
        ...(name && { name: { [Op.like]: `%${name}%` } }), // Filter by batch name
      },
      include: [
        {
          model: Branch,
          where: {
            instituteId: req.user?.instituteId,
            ...(branch && { id: branch }), // Filter by branchId if branch is provided
          },
        },
        {
          model: Course,
        },
        {
          model: Faculty,
          where: {
            ...(facultyName && { id:facultyName }), // Filter by batch name
          },
          through: { attributes: [] }, // Exclude join table attributes
          include: [
            {
              model: User,
              as: "User",
              attributes: ["id", "fullName"], // Select fullName
              
            },
          ],
        },
      ],
    });

    if (!batches || batches.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Batches not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: batches,
      message: "Batch fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const updateBatch = async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId, moduleId } = req.body;
  try {
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    // Update batch details
    await batch.update({
      name,
      description,
      branchId,
    });

    // if (moduleId && moduleId.length > 0) {
    //   // Get current modules associated with the batch
    //   const currentModules = batch.Modules.map((module) => module.id);

    //   // Determine modules to add and remove
    //   const modulesToAdd = moduleId.filter(
    //     (id) => !currentModules.includes(id)
    //   );
    //   const modulesToRemove = currentModules.filter(
    //     (id) => !moduleId.includes(id)
    //   );

    //   // Add new modules
    //   if (modulesToAdd.length > 0) {
    //     await batch.addModules(modulesToAdd, {
    //       through: { createdBy: req.user.id },
    //     });
    //   }

    //   // Remove old modules
    //   if (modulesToRemove.length > 0) {
    //     await batch.removeModules(modulesToRemove);
    //   }
    // } else {
    //   // Remove all modules if no moduleId is provided
    //   await batch.removeModules(batch.Modules.map((module) => module.id));
    // }

    return res.status(200).json({
      success: true,
      data: batch,
      message: "Batch updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteBatch = async (req, res, next) => {
  const { id } = req.params;
  try {
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }

    await batch.destroy();

    return res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllBatchs = async (req, res) => {
  try {
    const batches = await Batch.findAll({
      include: {
        model: Branch,
      },
    });

    return res.status(200).json({
      success: true,
      data: batches,
      message: "Batches fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleBatch = async (req, res) => {
  const { id } = req.params;
  try {
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(400).json({
        success: false,
        message: "Batch not found",
      });
    }

    await batch.update({
      isActive: !batch.isActive,
    });

    return res.status(200).json({
      success: true,
      data: batch,
      message: "Batch toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const getBatchCalendar = async (req, res) => {
 
  const {branchId} = req.body;

  console.log(req.body);
  

  console.log('Body',branchId);
  
  
  try {
    const batches = await BatchCalendar.findAll({
      include: {
        model: Batch,
        attributes: ['name'],
        where: {
          branchId: branchId,
        },
        include: [
          {
            model: Faculty,
            attributes: ['id'],
          },
        ],
      },
    });

    const transformedBatches = batches.map(batchCalendar => ({
      batchId: batchCalendar.batchId,
      startDateTime: batchCalendar.startDateTime,
      endDateTime: batchCalendar.endDateTime,
      remarks: batchCalendar.remarks,
      isActive: batchCalendar.isActive,
      batch_name: batchCalendar.Batch.name,
      facultyId: batchCalendar.Batch.Faculties[0]?.id
    }));

    return res.status(200).json({
      success: true,
      data: transformedBatches,
      message: "Batches fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBatchbyFaculty = async (req, res) => {
  const { branchId, facultyId } = req.body;

  console.log(req.body);
  console.log('Body', branchId, facultyId);

  try {
    const result = await Batch.findAll({
      attributes:['id','name'],
      include: {
            model: Faculty,
            attributes: [],
            where: {
              id: req.body.facultyId,
              isActive: 1
            }
          },
          where: {
            branchId: req.body.branchId,
            isActive: 1
          },
    });

    if (result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No Batches found for the given Faculty on the current day.",
      });
    } else {
      return res.status(200).json({
        success: true,
        data: result,
        message: "Batches Fetched Successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  createBatch,
  getBatchByBranchId,
  updateBatch,
  deleteBatch,
  getAllBatchs,
  toggleBatch,
  getBatchById,
  getBatchByInstituteId,
  getBatchByCourseId,
  getBatchCalendar,
  getBatchbyFaculty
};
