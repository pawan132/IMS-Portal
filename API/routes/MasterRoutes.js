const express = require("express");
const {
  getAllStates,
  getAllRoles
} = require("../controllers/MasterController");
const router = express.Router();

router.get("/states", getAllStates);
router.get("/roles", getAllRoles);

module.exports = router;
