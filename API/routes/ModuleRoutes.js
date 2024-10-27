const express = require("express");
const {
  createModule,
  getModuleByBranchId,
  updateModule,
  deleteModule,
  getAllModules,
  toggleModule,
  getModuleById,
  getModuleByInstituteId,
  getModuleByCustomBranchId,
  createModuleAdmin
} = require("../controllers/ModuleController");
const router = express.Router();

router.post("/createmodule", createModule);
router.post("/admin", createModuleAdmin);
router.put("/:id", updateModule);
router.get("/", getAllModules);
router.get("/branch", getModuleByBranchId);
router.get("/branch/:id", getModuleByCustomBranchId);
router.get("/institute", getModuleByInstituteId);
router.get("/:id", getModuleById);
router.delete("/:id", deleteModule);
router.put("/:id/toggle", toggleModule);

module.exports = router;
