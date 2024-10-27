const express = require("express");
const {
  createStudent,
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
  GetCheckMobile,
  markStudentAttendance
} = require("../controllers/StudentController");
const router = express.Router();

router.post("/", createStudent);
router.put("/:id", updateStudent);
router.get("/", getAllStudent);
router.post("/new-registration", createNewStudentRegistration);
router.get("/institute", getStudentByInstituteId);
router.get("/branch", getStudentByBranchId);
router.get("/:id", getStudentById);
router.delete("/:id", deleteStudent);
router.put("/:id/toggle", toggleStudent);
router.post("/attendance",StudentAttendanceRecords);
router.post("/bybatch/",GetStudentsByBatches);
router.post("/mobile",GetCheckMobile);
router.post("/mark-attendance",markStudentAttendance);

module.exports = router;
