const Branch = require("../models/Branch");
const Role = require("../models/Role");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const { sendPasswordResetEmail } = require("../utils/SendEmail");
require("dotenv").config();
const bcrypt = require('bcryptjs')

// Get user by ID
const getUserById = async (req, res) => {
  const { userId } = req.user;
  // console.log(userId);
  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", "fullName", "email", "mobile"],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateUserById = async (req, res) => {
  const { userId } = req.user;
  const { fullName, email, mobile } = req.body;

  try {
    // Fetch the user including the primary key
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's information
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      mobile: mobile || user.mobile,
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const updateUserByExtId = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, mobile } = req.body;

  try {
    // Fetch the user including the primary key
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the user's information
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      mobile: mobile || user.mobile,
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const addUser = async (req, res) => {
  // console.log(req.body);
  try {
    const {
      name,
      email,
      mobile,
      branchId,
      roleId
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "email already registered",
      });
    }

    const existingMobile = await User.findOne({ where: { mobile } });
    if (existingMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile already registered",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(
      process.env.DEFAULT_PASSWORD,
      salt
    );

    const user = await User.create({
      fullName: name,
      email,
      mobile,
      password: hashedPassword,
      salt: salt,
      isEmailVerified: false,
      roleId: roleId,
      branchId: branchId
    });

    await UserRole.create({
      userId: user.id,
      roleId: roleId,
      branchId: branchId,
    });

    await sendPasswordResetEmail(email, user.id);

    return res.status(201).json({
      success: true,
      message: "Registration successful. A verification email has been sent.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["userId", "email", "mobile", "accountType"],
    });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const getAllUsersByInstitute = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id","fullName", "email", "mobile", "roleId", "isActive"],
      include: [
        {
          model: Branch,
          attributes: ["id", "name"],
          where: { instituteId: req.user?.instituteId },
        },
        {
          model: Role,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!users) {
      return res.status(400).json({
        success: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

module.exports = {
  deleteUser,
  getUserById,
  getAllUsers,
  updateUserById,
  getAllUsersByInstitute,
  addUser,
  updateUserByExtId
};
