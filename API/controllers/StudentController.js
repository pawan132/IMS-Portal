const Address = require("../models/Address");
const Student = require("../models/Student");
const Branch = require("../models/Branch");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");
const StudentAttendance = require("../models/StudentAttendance");
const {
  sendInvitationEmail,
  sendPasswordResetEmail,
} = require("../utils/SendEmail");
const bcrypt = require("bcryptjs");
const Parent = require("../models/Parent");
const StudentBatchMapping = require("../models/StudentBatchMapping");
const Course = require("../models/Course");
const Batch = require("../models/Batch");
const Payment = require("../models/Payment");
const PaymentSchedule = require("../models/PaymentSchedule");
const BatchCalendar = require("../models/BatchCalendar");
const Faculty = require("../models/Faculty");
const { where } = require("sequelize");
const FacultyBatchMapping = require("../models/FacultyBatchMapping");
const { Op } = require('sequelize');

const createStudent = async (req, res, next) => {
  const {
    User: userDetails,
    branchId,
    Address: addressDetails,
    courseId,
    batchId,
    Parents: parentDetails,
    admissionNo,
    payments,
    modalData,
    isOneTime
  } = req.body;

  console.log('req.body: ', req.body);
  const paymentData = {
    modalData,
    payments,
    isOneTime
  }

  console.log('paymentData: ', paymentData);

  try {
    const existingUser = await User.findOne({
      where: { email: userDetails.email },
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
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

    const existingAdmissionNo = await Student.findOne({
      where: { admissionNo },
    });
    if (existingAdmissionNo) {
      return res.status(400).json({
        success: false,
        message: "Admission No already registered",
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
      roleId: 5,
      branchId: branchId,
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

    const student = await Student.create({
      branchId,
      addressId: newAddress ? newAddress.id : null,
      userId: user.id,
      courseId,
      batchId,
      admissionNo,
    });

    const adminRole = await Role.findOne({ where: { name: "Student" } });
    await UserRole.create({
      userId: user.id,
      roleId: adminRole.id,
      branchId: branchId,
    });

    await StudentBatchMapping.create({
      studentId: student.id,
      batchId: batchId,
    });

    if (parentDetails && parentDetails.length > 0) {
      for (const parent of parentDetails) {
        await Parent.create({
          studentId: student.id,
          name: parent.name,
          email: parent.email,
          mobile: parent.mobile,
          relation: parent.relation,
          createdBy: req.user.id,
        });
      }
    }

    const payment = await Payment.create({
      studentId: student.id,
      admissionNo: student.admissionNo,
      baseFees: paymentData.modalData.baseFees,
      discount: paymentData.modalData.discount,
      scholarship: paymentData.modalData.scholar,
      grossFees: paymentData.modalData.grossFees,
      tax: paymentData.modalData.tax,
      netFees: paymentData.modalData.netFees,
      isOneTime: paymentData.isOneTime,
      status: paymentData.isOneTime ? "Pending" : "Partial",
      createdBy: req.user.id,
    });

    if (!paymentData.isOneTime) {
      if (paymentData.payments && paymentData.payments.length > 0) {
        for (const pay of paymentData.payments) {
          await PaymentSchedule.create({
            paymentId: payment.id,
            date: pay.date,
            amount: pay.amount,
            createdBy: req.user.id,
          });
        }
      }
    }

    await sendPasswordResetEmail(userDetails.email, user.id);

    return res.status(200).json({
      success: true,
      data: student,
      message: "Student created successfully. Password reset link sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


const GetCheckMobile= async(req, res) => {
  const { mobile } = req.body;

  // Query to check if the mobile number exists in the database
  const user = await User.findOne({ where: { mobile } });

  if (user) {
    return res.json({ exists: true });
  } else {
    return res.json({ exists: false });
  }
};

const createNewStudentRegistration = async (req, res, next) => {
  const { paymentData, registrationModalData } = req.body;

  console.log(req.body);

  try {
    const existingStudent = await Student.findByPk(registrationModalData.id);

    const student = await Student.create({
      branchId: registrationModalData.branchId,
      addressId: existingStudent ? existingStudent.addressId : null,
      userId: registrationModalData.userId,
      courseId: registrationModalData.courseId,
      batchId: registrationModalData.batchId,
      admissionNo: registrationModalData.admissionNo,
    });

    await StudentBatchMapping.create({
      studentId: student.id,
      batchId: registrationModalData.batchId,
    });

    const payment = await Payment.create({
      studentId: student.id,
      admissionNo: student.admissionNo,
      baseFees: paymentData.modalData.baseFees,
      discount: paymentData.modalData.discount,
      scholarship: paymentData.modalData.scholar,
      grossFees: paymentData.modalData.grossFees,
      tax: paymentData.modalData.tax,
      netFees: paymentData.modalData.netFees,
      isOneTime: paymentData.isOneTime,
      status: paymentData.isOneTime ? "Pending" : "Partial",
      createdBy: req.user.id,
    });

    if (!paymentData.isOneTime) {
      if (paymentData.payments && paymentData.payments.length > 0) {
        for (const pay of paymentData.payments) {
          await PaymentSchedule.create({
            paymentId: payment.id,
            date: pay.date,
            amount: pay.amount,
            createdBy: req.user.id,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: student,
      message: "New registration created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id, {
      include: [{ model: Address }, { model: User, as: "User" }],
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: student,
      message: "Student fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getStudentByInstituteId = async (req, res) => {
  try {
    const { name, branch, courseName , batch } = req.query; 

    const students = await Student.findAll({
      include: [
        {
          model: Address,
        },
        {
          model: User,
          as: "User",
          attributes: ["fullName", "email", "mobile"],
          where: { roleId: 5 },
          ...(name && { fullName: { [Op.like]: `%${name}%` } }),
        },
        {
          model: Branch,
          where: { instituteId: req.user?.instituteId },
        },
        {
          model: Course,
          where: courseName ? { id: courseName } : {},
        },
        {
          model: Batch,

          attributes: ["id", "name"],
          where: batch ? { id: batch } : {}, 
        },
        {
          model: Parent, // Direct association
          as: "Parents",
          attributes: ["id", "name", "email", "mobile", "relation"],
        },
      ],
    });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      data: students,
      message: "Students fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getStudentByBranchId = async (req, res) => {
 
  try {
    const students = await Student.findAll({
      include: [
        {
          model: Address,
        },
        {
          model: User,
          as: "User",
          attributes: ["fullName", "email", "mobile"],
          where: { roleId: 5 },
        },
        {
          model: Branch,
          where: { id: req.user?.branchId },
        },
        {
          model: Course,
        },
        {
          model: Batch,
          attributes: ["id", "name"],
        },
        {
          model: Parent, // Direct association
          as: "Parents",
          attributes: ["id", "name", "email", "mobile", "relation"],
        },
      ],
    });

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    return res.status(200).json({
      success: true,
      data: students,
      message: "Students fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    User: userDetails,
    Address: addressDetails,
    branchId,
    courseId,
    batchId,
    Parents: parentDetails,
  } = req.body;

  try {
    const student = await Student.findByPk(id, {
      include: [
        { model: Address, as: "Address" },
        { model: User, as: "User" },
        { model: Parent, as: "Parents" },
      ],
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update Address details if provided
    if (addressDetails) {
      const address = await Address.findByPk(student.addressId);

      if (!address) {
        const newAddress = await Address.create({
          address: addressDetails.address,
          city: addressDetails.city,
          state: addressDetails.state,
          country: addressDetails.country,
          postalCode: addressDetails.postalCode,
        });
        student.addressId = newAddress.id;
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

    // Update User details if provided
    if (userDetails) {
      const user = await User.findByPk(student.userId);
      await user.update({
        fullName: userDetails.fullName,
        email: userDetails.email,
        mobile: userDetails.mobile,
      });
    }

    // Update Parent details if provided
    if (parentDetails && parentDetails.length > 0) {
      // Remove existing parents
      await Parent.destroy({ where: { studentId: student.id } });

      // Create new parent records
      for (const parent of parentDetails) {
        await Parent.create({
          studentId: student.id,
          name: parent.name,
          email: parent.email,
          mobile: parent.mobile,
          relation: parent.relation,
          createdBy: req.user.id,
        });
      }
    }

    // Update Student details
    await student.update({
      branchId,
      courseId,
      batchId,
      modifiedBy: req.user.id,
      modifiedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      data: student,
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res, next) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.destroy();

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const faculties = await Student.findAll({
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

const toggleStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    await student.update({
      isActive: !student.isActive,
    });

    return res.status(200).json({
      success: true,
      data: student,
      message: "Student toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const StudentAttendanceRecords = async (req, res) => {
  const { branchId } = req.body;
  try {
    const result = await StudentAttendance.findAll({
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
        message: "Student Attendance Details not found",
      });
    }
    else{

      const transformedResult = result.map(data => ({
        studentId: data.studentId,
        title: data.BatchCalendar.Batch.name,
        start: data.BatchCalendar.startDateTime,
        end: data.BatchCalendar.endDateTime,
        status:data.status,
        facultyId: data.facultyId,
        remarks: data.remarks,
        isActive: data.isActive,
      }));


      return res.status(200).json({
        success: true,
        data: transformedResult,
        message: "Student Attendance Fetched Successfully",
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


// const GetStudentsByBatches = async (req, res) => {
//   console.log('Working Batch');
//   const { branchId, facultyId } = req.body;
//   console.log(req.body);

//   try {
//     const result = await BatchCalendar.findAll({
//       attributes: ['id'],
//       where:{
//         batchId:11,
//         isActive:1,
//         startDateTime:'2024-08-13'
//       },
//       include: [  
//         {
//           model:Batch,
//           attributes:['name'],
//           where: {
//             branchId: 12,
//             isActive: 1,
//           },
//           include:{
            
//               model: Student,
//               as: 'Students',
//               attributes:['id'],
//               include: {
//                 model: User,
//                 as: 'User',
//                 attributes: ['fullName'],
              
//             },
//           }
//         },
          
//         ],
//     });

//     if (!result || result.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Details not found",
//       });
//     }

//     // const transformedResult = result.map(batchCalendar => {
//     //   return batchCalendar.Batch.Students.map(student => ({
//     //     studentId: student.User.id,
//     //     fullName: student.User.fullName,
//     //     batchName: batchCalendar.Batch.name,
//     //   }));
//     // }).flat();

//     return res.status(200).json({
//       success: true,
//       data: result,
//       message: "Data Fetched Successfully",
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "An unexpected error occurred.",
//       error: error.message,
//     });
//   }
// };

const GetStudentsByBatches = async (req, res) => {
  console.log('Working Batch');
  const { batchId } = req.body;
  console.log(req.body);

  try {
    const result = await Batch.findOne({
      attributes: ['name'], // Fetch only the batch name
      where: {
        id: batchId,
        branchId: 12,
        isActive: 1,
      },
      include: {
        model: Student,
        as: 'Students',
        attributes: ['id'], // Fetch only the student id
        include: {
          model: User,
          as: 'User',
          attributes: ['fullName'], // Fetch the student's full name
        },
      },
    });

    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Details not found",
      });
    }

    // Extracting students from the result
    const students = result.Students.map(student => ({
      id: student.id,
      fullName: student.User.fullName,
    }));

    return res.status(200).json({
      success: true,
      data: {
        batchName: result.name,
        students: students,
      },
      message: "Data Fetched Successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const markStudentAttendance = async (req, res) => {
  try {
    console.log("body", req.body);
    const { batchId, branchId, userId, attendanceRecords, date } = req.body;

    // Using Promise.all to wait for all async operations
    await Promise.all(
      Object.entries(attendanceRecords).map(async ([studentId, status]) => {
        try {
          await StudentAttendance.create({
            branchId,
            batchId,
            facultyId: userId,
            Date: date ? new Date(date) : new Date(), // Correctly creating a Date object
            studentId,
            status: status.toLowerCase() === 'absent' ? 'A' : 'P'
          });
        } catch (createError) {
          console.error(`Error creating attendance for student ${studentId}:`, createError);
          // Handle or log the error for individual records if needed
        }
      })
    );

    return res.status(200).json({
      success: true,
      data: "",
      message: "Attendance marked successfully",
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
  createStudent,
  GetCheckMobile,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllStudent,
  toggleStudent,
  getStudentByInstituteId,
  getStudentByBranchId,
  createNewStudentRegistration,
  StudentAttendanceRecords,
  GetStudentsByBatches,
  markStudentAttendance
};
