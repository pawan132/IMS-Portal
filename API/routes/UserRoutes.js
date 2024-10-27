const express = require("express");
const router = express.Router();
const {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUserById,
  getAllUsersByInstitute,
  addUser,
  updateUserByExtId
} = require("../controllers/UserController");

router.get("/", getUserById);
router.post("/", addUser);
router.put("/", updateUserById);
router.put("/:userId", updateUserByExtId);
router.get("/institute", getAllUsersByInstitute);
router.get("/all", getAllUsers);
router.delete("/:id", deleteUser);

module.exports = router;