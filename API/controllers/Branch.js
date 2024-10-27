const Branch = require("../models/Branch");

const createBranch = async (req, res, next) => {
  const {
    instituteId,
    name,
    address,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
    emailId,
    website,
    establishedYear,
    isActive,
  } = req.body;
  try {
    const branch = await Branch.create({
      instituteId,
      name,
      address,
      city,
      state,
      country,
      postalCode,
      phoneNumber,
      emailId,
      website,
      establishedYear,
      isActive,
    });
    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(400).json({
        success: true,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateBranch = async (req, res, next) => {
  const { id } = req.params;
  const {
    instituteId,
    name,
    address,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
    emailId,
    website,
    establishedYear,
    isActive,
  } = req.body;
  try {
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(400).json({
        success: true,
        message: "Branch not found",
      });
    }

    await branch.update({
      instituteId,
      name,
      address,
      city,
      state,
      country,
      postalCode,
      phoneNumber,
      emailId,
      website,
      establishedYear,
      isActive,
    });

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteBranch = async (req, res, next) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(400).json({
        success: true,
        message: "Branch not found",
      });
    }

    await branch.destroy();

    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();
    return res.status(200).json({
      success: true,
      data: branches,
      message: "Branch fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
  getAllBranches,
};
