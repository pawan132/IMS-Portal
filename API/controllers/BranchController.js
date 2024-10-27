const Address = require("../models/Address");
const Branch = require("../models/Branch");
const Institute = require("../models/Institute");

const createBranch = async (req, res, next) => {
  const {
    name,
    instituteId,
    Address: addressDetails,
    mobile,
    email,
  } = req.body;

  try {
    let newAddress = null;
    if (addressDetails) {
      newAddress = await Address.create({
        address: addressDetails.address,
        city: addressDetails.city,
        state: addressDetails.state,
        country: addressDetails.country,
        postalCode: addressDetails.postalCode,
      });
    }

    const branch = await Branch.create({
      name: name,
      instituteId: req.user?.instituteId, // Dynamically assign institute ID
      addressId: newAddress ? newAddress.id : null,
      mobile,
      email,
    });

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBranchById = async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findByPk(id, {
      include: {
        model: Address,
      },
    });

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getBranchByInstituteId = async (req, res) => {
  try {
    const branch = await Branch.findAll({
      where: { instituteId: req.user?.instituteId },
      include: {
        model: Address,
      },
    });

    // console.log(branch);

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { name, Address: addressDetails, mobile, email } = req.body;
  try {
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch not found",
      });
    }

    let newAddress = null;

    if (addressDetails) {
      const address = await Address.findByPk(branch.addressId);

      if (!address) {
        newAddress = await Address.create({
          address: addressDetails.address,
          city: addressDetails.city,
          state: addressDetails.state,
          country: addressDetails.country,
          postalCode: addressDetails.postalCode,
        });
      } else {
        await address.update({
          address: addressDetails.address,
          city: addressDetails.city,
          state: addressDetails.state,
          country: addressDetails.country,
          postalCode: addressDetails.postalCode,
        });
      }
    }

    await branch.update({
      name,
      mobile,
      email,
      addressId: newAddress ? newAddress.id : branch.addressId
    });

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch updated successfully",
    });
  } catch (error) {
    console.error(error);
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
        success: false,
        message: "Branch not found",
      });
    }

    await branch.destroy();

    return res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllBranch = async (req, res) => {
  try {
    const branches = await Branch.findAll({
      include: {
        model: Address,
      },
    });

    return res.status(200).json({
      success: true,
      data: branches,
      message: "Branches fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const toggleBranch = async (req, res) => {
  const { id } = req.params;
  try {
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(400).json({
        success: false,
        message: "Branch not found",
      });
    }

    await branch.update({
      isActive: !branch.isActive,
    });

    return res.status(200).json({
      success: true,
      data: branch,
      message: "Branch toggled successfully",
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
  createBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
  getAllBranch,
  toggleBranch,
  getBranchByInstituteId,
};
