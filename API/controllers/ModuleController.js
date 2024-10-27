const Branch = require("../models/Branch");
const Module = require("../models/Module");

const createModule = async (req, res, next) => {
  const { name, description, branchId } = req.body;

  try {
    const module = await Module.create({
      name,
      description,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const createModuleAdmin = async (req, res, next) => {
  const { name, description, branchId } = req.body;

  try {
    const module = await Module.create({
      name,
      description,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const createModuleByBranch = async (req, res, next) => {
  const { name, description } = req.body;
  const { branchId } = req.user;

  try {
    const module = await Module.create({
      name,
      description,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getModuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const module = await Module.findByPk(id, {
      include: {
        model: Branch,
      },
    });

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getModuleByBranchId = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: { model: Branch, where: { id: req.user?.branchId } },
    });

    if (!modules) {
      return res.status(400).json({
        success: false,
        message: "Modules not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: modules,
      message: "Module fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getModuleByCustomBranchId = async (req, res) => {
  const { id } = req.params;
  try {
    const modules = await Module.findAll({
      where: { branchId: id },
    });

    if (!modules) {
      return res.status(400).json({
        success: false,
        message: "Modules not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: modules,
      message: "Module fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getModuleByInstituteId = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: { model: Branch, where: { instituteId: req.user?.instituteId } },
    });

    if (!modules) {
      return res.status(400).json({
        success: false,
        message: "Modules not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: modules,
      message: "Module fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateModule = async (req, res) => {
  const { id } = req.params;
  const { name, description, branchId } = req.body;
  try {
    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module not found",
      });
    }

    await module.update({
      name,
      description,
      branchId,
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteModule = async (req, res, next) => {
  const { id } = req.params;
  try {
    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module not found",
      });
    }

    await module.destroy();

    return res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      include: {
        model: Branch,
      },
    });

    return res.status(200).json({
      success: true,
      data: modules,
      message: "Modules fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleModule = async (req, res) => {
  const { id } = req.params;
  try {
    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module not found",
      });
    }

    await module.update({
      isActive: !module.isActive,
    });

    return res.status(200).json({
      success: true,
      data: module,
      message: "Module toggled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
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
};
