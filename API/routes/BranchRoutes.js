const express = require("express");
const {
  createBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
  getAllBranch,
  toggleBranch,
  getBranchByInstituteId,
} = require("../controllers/BranchController");
const router = express.Router();

router.post("/", createBranch);
router.put("/:id", updateBranch);
router.get("/", getAllBranch);
router.get("/institute", getBranchByInstituteId);
router.get("/:id", getBranchById);
router.delete("/:id", deleteBranch);
router.put("/:id/toggle", toggleBranch);

module.exports = router;
