const express = require("express");
const {
  createCourse,
  getCourseByBranchId,
  updateCourse,
  deleteCourse,
  getAllCourses,
  toggleCourse,
  getCourseById,
  getCourseByInstituteId,
  createCourseAdmin,
  getCourseByCustomBranchId,
} = require("../controllers/CourseController");
const router = express.Router();

router.post("/", createCourse);
router.post("/admin", createCourseAdmin);
router.put("/:id", updateCourse);
router.get("/", getAllCourses);
router.get("/branch", getCourseByBranchId);
router.get("/branch/:branchId", getCourseByCustomBranchId);
router.get("/institute", getCourseByInstituteId);
router.get("/:id", getCourseById);
router.delete("/:id", deleteCourse);
router.put("/:id/toggle", toggleCourse);

module.exports = router;
