const express = require("express");

const {registerStudent,getRegisterStudent,updateRegister} = require('../controllers/StudentRegistrationController');

const router = express.Router();

router.post("/", registerStudent);

router.get('/branch',getRegisterStudent);

router.put('/updateRegister',updateRegister)

module.exports = router;