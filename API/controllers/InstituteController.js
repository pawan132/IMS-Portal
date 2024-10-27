const Address = require("../models/Address");
const Branch = require("../models/Branch");
const Institute = require("../models/Institute");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const jwt = require("jsonwebtoken");

const createInstitute = async (req, res, next) => {
  const {
    name,
    address,
    city,
    state,
    country,
    postalCode,
    mobile,
    email,
    website,
    establishedYear,
  } = req.body;

  // console.log(req.body);
  try {
    let newAddress = null;
    if (address && city && state && country && postalCode) {
      newAddress = await Address.create({
        address,
        city,
        state,
        country,
        postalCode,
      });
    }

    const institute = await Institute.create({
      name,
      mobile,
      email,
      website,
      establishedYear,
      addressId: newAddress ? newAddress.id : null,
    });

    const branch = await Branch.create({
      instituteId: institute.id,
      name: institute.name,
      addressId: institute.addressId,
      mobile: institute.mobile,
      email: institute.email,
      establishedYear: institute.establishedYear,
    });

    await UserRole.update(
      {
        branchId: branch.id,
      },
      {
        where: {
          userId: req.user.userId,
        },
      }
    );

    await User.update(
      {
        branchId: branch.id,
      },
      {
        where: {
          id: req.user.userId,
        },
      }
    );

    const token = jwt.sign(
      {
        email: req.user?.email,
        userId: req.user?.userId,
        roleId: req.user?.roleId,
        branchId: branch.id,
        instituteId: institute.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      data: institute,
      branch: branch,
      token: token,
      message: "Institute created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getInstituteById = async (req, res) => {
  const { id } = req.params;
  try {
    const institute = await Institute.findByPk(id, {
      include: {
        model: Address,
      },
    });

    if (!institute) {
      return res.status(400).json({
        success: false,
        message: "Institute not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: institute,
      message: "Institute fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateInstitute = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    city,
    state,
    country,
    postalCode,
    mobile,
    email,
    website,
    establishedYear,
  } = req.body;

  const instituteId = req.user.instituteId;

  // console.log(instituteId);
  // console.log(req.body);
  try {
    const institute = await Institute.findByPk(instituteId);

    if (!institute) {
      return res.status(400).json({
        success: false,
        message: "Institute not found",
      });
    }

    const existingAddress = await Address.findByPk(institute.addressId);
    // console.log("existingAddress: ", existingAddress);
    let newAddress = null;

    if (!existingAddress) {
      if (address && city && state && country && postalCode) {
        newAddress = await Address.create({
          address,
          city,
          state,
          country,
          postalCode,
        });
      }
    } else {
      // console.log("updating adresssssss");
      await existingAddress.update({
        address,
        city,
        state,
        country,
        postalCode,
      });
    }

    await institute.update({
      name,
      mobile,
      email,
      website,
      establishedYear,
      addressId: newAddress !== null ? newAddress.id : institute.addressId,
    });

    return res.status(200).json({
      success: true,
      data: institute,
      message: "Institute updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const deleteInstitute = async (req, res, next) => {
  const { id } = req.params;
  try {
    const institute = await Institute.findByPk(id);

    if (!institute) {
      return res.status(400).json({
        success: false,
        message: "Institute not found",
      });
    }

    await institute.destroy();

    return res.status(200).json({
      success: true,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllInstitutes = async (req, res, next) => {
  try {
    const institutes = await Institute.findAll();
    return res.status(200).json({
      success: true,
      data: institutes,
      message: "Institutes fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  createInstitute,
  getInstituteById,
  updateInstitute,
  deleteInstitute,
  getAllInstitutes,
};
