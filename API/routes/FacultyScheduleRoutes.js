const express = require('express');
const {  createFacultyAvailability, GetFacultySchedule } = require('../controllers/FacultySchedule.controller');
// const { GetFacultyAvailability } = require('../controllers/GetFacultyAvailability.controller');
const router = express.Router();



router.post('/availability', createFacultyAvailability);

// router.get('/faculty/availability/:facultyId', GetFacultyAvailability);
router.get('/faculty/schedule', GetFacultySchedule);
  

module.exports = router;
