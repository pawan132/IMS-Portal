const express = require("express");
const {
    getDashboardCardsByInstitute,
    getDashboardCardsByBranch
} = require("../controllers/DashboardController");
const router = express.Router();

router.get("/dashboardCards/institute", getDashboardCardsByInstitute);
router.get("/dashboardCards/branch", getDashboardCardsByBranch);

module.exports = router;
