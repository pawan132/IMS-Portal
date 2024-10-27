const express = require("express");
const {
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
} = require("../controllers/FacultyController");

const router = express.Router();

router.post("/", createFaculty);
router.put("/:id", updateFaculty);
router.get("/", getAllFaculty);
router.get("/institute", getFacultyByInstituteId);
router.get("/branch", getFacultyByBranchId);
router.post("/branch/:branchId/modules", getFacultyByBranchIdModule);

router.get("/module/:moduleId", GetFacultyByModuleId);
router.get("/:id", getFacultyById);
router.delete("/:id", deleteFaculty);
router.put("/:id/toggle", toggleFaculty);
router.post("/attendance", FacultyAttendanceRecords);
router.post('/availability/', createFacultyAvailability);
// router.get('/faculty/availability/:facultyId', GetFacultyAvailability);

module.exports = router;
