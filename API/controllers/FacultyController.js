const Address = require("../models/Address");
const Faculty = require("../models/Faculty");
const Branch = require("../models/Branch");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");
const FacultyAttendance = require("../models/FacultyAttendance");
const FacultySchedule = require("../models/FacultySchedule");
const BatchCalendar = require("../models/BatchCalendar");
const Batch = require("../models/Batch");
const { sendInvitationEmail, sendPasswordResetEmail } = require("../utils/SendEmail");
const bcrypt = require("bcryptjs");
const Module = require("../models/Module");
const { Op } = require("sequelize");

const createFaculty = async (req, res, next) => {
  const {
    User: userDetails,
    branchId,
    Address: addressDetails,
    moduleId,
  } = req.body;

  // console.log(req.body);

  try {
    const existingUser = await User.findOne({
      where: { email: userDetails.email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Faculty already exists",
      });
    }

    const existingMobile = await User.findOne({
      where: { mobile: userDetails.mobile },
    });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already registered",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_PASSWORD,
      salt
    );

    const user = await User.create({
      fullName: userDetails.fullName,
      email: userDetails.email,
      mobile: userDetails.mobile,
      password: hashedPassword,
      salt: salt,
      isEmailVerified: false,
      roleId: 4,
      branchId: branchId
    });

    let newAddress = null;
    if (addressDetails) {
      newAddress = await Address.create({
        address: addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state,
        country: addressDetails.country,
        postalCode: addressDetails.postalCode,
      });
    }

    const faculty = await Faculty.create({
      branchId,
      addressId: newAddress ? newAddress.id : null,
      userId: user.id,
      // added later start date and date
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    if (moduleId && moduleId.length > 0) {
      await faculty.addModules(moduleId, {
        through: { createdBy: req.user.id },
      });
    }

    const adminRole = await Role.findOne({ where: { name: "Faculty" } });
    await UserRole.create({
      userId: user.id,
      roleId: adminRole.id,
      branchId: branchId,
    });

    await sendPasswordResetEmail(userDetails.email, user.id);

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getFacultyById = async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findByPk(id, {
      include: [{ model: Address }, { model: User, as: "User" }],
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getFacultyByInstituteId = async (req, res) => {
  try {
    const { name, branch } = req.query;

    const filters = {
      include: [
        { model: Address },
        {
          model: User,
          as: "User",
          where: {
            roleId: 4,
            ...(name && { fullname: { [Op.like]: `%${name}%` } }), // Filter by name using LIKE if name is provided
          },
        },
        {
          model: Branch,
          where: {
            instituteId: req.user?.instituteId,
            ...(branch && { id: branch }), // Filter by branchId if branch is provided
          },
        },
        {
          model: Module,
          as: "Modules",
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    };

    const faculty = await Faculty.findAll(filters);

    if (faculty.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const getFacultyByBranchId = async (req, res) => {
  try {
    const faculty = await Faculty.findAll({
      include: [
        { model: Address },
        {
          model: User,
          as: "User",
          where: {roleId: 4}
        },
        { model: Branch, where: { id: req.user?.branchId } },
        {
          model: Module,
          as: "Modules",
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    // console.log(faculty);

    if (faculty.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getFacultyByBranchIdModule = async (req, res) => {
  const { branchId } = req.params;
  const { moduleIds } = req.body;

  const moduleIdsArray = moduleIds.map((module) => module.id);
  // console.log(moduleIdsArray);
  // console.log(branchId);

  try {
    // First, get distinct faculty IDs and names
    const distinctFaculty = await Faculty.findAll({
      include: [
        {
          model: Module,
          as: "Modules",
          where: { id: { [Op.in]: moduleIdsArray } },
          attributes: [], // Exclude module attributes
          through: { attributes: [] }, // Exclude join table attributes
        },
        {
          model: User,
          as: "User",
          where: {roleId: 4},
          attributes: ["id", "fullName"], // Only select the faculty ID and name
        },
      ],
      where: { branchId },
      attributes: ["id"],
      group: ["Faculty.id", "User.fullName"],
      raw: true, // Ensures that we get raw data instead of instances
    });

    const facultyData = distinctFaculty.map((faculty) => ({
      id: faculty["id"],
      fullName: faculty["User.fullName"],
    }));

    // console.log(facultyData);

    if (facultyData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: facultyData,
      message: "Faculty fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const GetFacultyByModuleId = async (req, res) => {
  const { moduleId } = req.params;
  

  
  // console.log(moduleIdsArray);
  // console.log(branchId);

  try {
    // First, get distinct faculty IDs and names
    const distinctFaculty = await Faculty.findAll({
      include: [
        { model: Address },
        {
          model: User,
          as: "User",
          where: {roleId: 4}
        },
        { model: Branch },
        {
          model: Module,
          as: "Modules",
          where: {
            id: moduleId,  // Filtering based on moduleId
          },
          through: { attributes: [] }, // Exclude join table attributes
        }
      ] 
    });
   

    if (distinctFaculty.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: distinctFaculty,
      message: "Faculty fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const updateFaculty = async (req, res) => {
  const { id } = req.params;
  const {
    User: userDetails,
    Address: addressDetails,
    branchId,
    moduleId,
  } = req.body;
  try {
    const faculty = await Faculty.findByPk(id, {
      include: [{ model: Module, as: "Modules" }],
    });

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    let newAddress = null;

    if (addressDetails) {
      const address = await Address.findByPk(faculty.addressId);

      if (!address) {
        newAddress = await Address.create({
          address: addressDetails.address,
          city: addressDetails.city,
          state: addressDetails.state,
          country: addressDetails.country,
          postalCode: addressDetails.postalCode,
        });
      } else {
        await address.update({
          address: addressDetails.address,
          city: addressDetails.city,
          state: addressDetails.state,
          country: addressDetails.country,
          postalCode: addressDetails.postalCode,
        });
      }
    }

    let newUser = null;

    if (userDetails) {
      const user = await User.findByPk(faculty.userId);
      if (!user) {
        newUser = await User.create({
          fullName: userDetails.fullName,
          email: userDetails.email,
          mobile: userDetails.mobile,
          password: hashedPassword,
          salt: salt,
          isEmailVerified: false,
        });
      } else {
        await user.update({
          fullName: userDetails.fullName,
          email: userDetails.email,
          mobile: userDetails.mobile,
        });
      }
    }

    await faculty.update({
      branchId,
      addressId: newAddress ? newAddress.id : null,
      userId: newUser ? newUser.id : faculty.userId,
      // added later
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    if (moduleId && moduleId.length > 0) {
      // Get current modules associated with the faculty
      const currentModules = faculty.Modules.map((module) => module.id);

      // Determine modules to add and remove
      const modulesToAdd = moduleId.filter(
        (id) => !currentModules.includes(id)
      );
      const modulesToRemove = currentModules.filter(
        (id) => !moduleId.includes(id)
      );

      // Add new modules
      if (modulesToAdd.length > 0) {
        await faculty.addModules(modulesToAdd, {
          through: { createdBy: req.user.id },
        });
      }

      // Remove old modules
      if (modulesToRemove.length > 0) {
        await faculty.removeModules(modulesToRemove);
      }
    } else {
      // Remove all modules if no moduleId is provided
      await faculty.removeModules(faculty.Modules.map((module) => module.id));
    }

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteFaculty = async (req, res, next) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findByPk(id);

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    await faculty.destroy();

    return res.status(200).json({
      success: true,
      message: "Faculty deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.findAll({
      include: { model: Address },
    });

    return res.status(200).json({
      success: true,
      data: faculties,
      message: "Faculties fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleFaculty = async (req, res) => {
  const { id } = req.params;
  try {
    const faculty = await Faculty.findByPk(id);

    if (!faculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found",
      });
    }

    await faculty.update({
      isActive: !faculty.isActive,
    });

    return res.status(200).json({
      success: true,
      data: faculty,
      message: "Faculty toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const FacultyAttendanceRecords = async (req, res) => {
  const { branchId } = req.body;
  try {
    const result = await FacultyAttendance.findAll({
      include: {
        model: BatchCalendar,
        attributes: ['startDateTime','endDateTime'],
        include:[
          {
            model: Batch,
            attributes: ['name'],
          },
        ],
      },
      where: {
        branchId: branchId,
      },
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Faculty Attendance Details not found",
      });
    }
    else{

      const transformedResult = result.map(data => ({
        facultyId: data.facultyId,
        title: data.BatchCalendar.Batch.name,
        start: data.BatchCalendar.startDateTime,
        end: data.BatchCalendar.endDateTime,
        status:data.status,
        remarks: data.remarks,
        isActive: data.isActive,
      }));

      return res.status(200).json({
        success: true,
        data: transformedResult,
        message: "Faculty Attendance Fetched Successfully",
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


const createFacultyAvailability = async (req, res) => {
  const { facultyId, availability } = req.body; 

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

module.exports = {
  createFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
  getAllFaculty,
  toggleFaculty,
  getFacultyByInstituteId,
  getFacultyByBranchIdModule,
  
  GetFacultyByModuleId,
  getFacultyByBranchId,
  FacultyAttendanceRecords,
  createFacultyAvailability
};
