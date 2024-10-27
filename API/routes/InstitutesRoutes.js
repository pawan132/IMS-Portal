const express = require("express");
const {
  createInstitute,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
  getAllInstitutes,
} = require("../controllers/InstituteController");
const router = express.Router();

router.post("/", createInstitute);
router.put("/", updateInstitute);
router.get("/", getAllInstitutes);
router.get("/:id", getInstituteById);
router.delete("/:id", deleteInstitute);

module.exports = router;
