const State = require('../models/State')
const Role = require('../models/Role')

const getAllStates = async (req, res, next) => {
  try {
    const states = await State.findAll();
    return res.status(200).json({
      success: true,
      data: states,
      message: "state fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const states = await Role.findAll({
      where: {
        name: ['Admin', 'Branch Admin', 'Relationship Manager']
      }
    });
    return res.status(200).json({
      success: true,
      data: states,
      message: "role fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
    getAllStates,
    getAllRoles
};
