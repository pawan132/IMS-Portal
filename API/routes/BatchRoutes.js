const express = require("express");
const {
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
} = require("../controllers/BatchController");
const router = express.Router();

router.post("/", createBatch);
router.put("/:id", updateBatch);
router.get("/", getAllBatchs);
router.post("/calendar",getBatchCalendar);
router.post("/byFaculty", getBatchbyFaculty);
router.get("/branch", getBatchByBranchId);
router.get("/institute", getBatchByInstituteId);
router.get("/course/:courseId", getBatchByCourseId);
router.get("/:id", getBatchById);
router.delete("/:id", deleteBatch);
router.put("/:id/toggle", toggleBatch);


module.exports = router;
