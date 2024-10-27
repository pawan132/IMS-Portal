const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");
const jwt = require("jsonwebtoken");
const Branch = require("../models/Branch");
const Token = require("../models/Token");
const { Op } = require("sequelize");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/SendEmail");
require("dotenv").config();

const login = async (req, res) => {
  const { emailOrMobile, password } = req.body;
  // console.log(req.body);
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrMobile },
          { mobile: emailOrMobile }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: "Email not verified, please verify email.",
      });
    }

    const userRole = await UserRole.findOne({ where: { userId: user.id } });
    let branch;
    if (userRole.branchId) {
      branch = await Branch.findOne({ where: { id: userRole.branchId } });
    }
    const role = await Role.findByPk(userRole.roleId);

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        roleId: userRole.roleId,
        branchId: userRole?.branchId,
        instituteId: userRole?.branchId ? branch.instituteId : null,
        name: user.fullName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const userDetails = {
      id: user.id,
      name: user.fullName,
      email: user.email,
      mobile: user.mobile,
      roleId: userRole.roleId,
      roleName: role.name,
      branchId: userRole?.branchId,
      instituteId: userRole?.branchId ? branch.instituteId : null,
      token: token,
    };

    // console.log(userDetails);

    return res.status(200).json({
      success: true,
      data: userDetails,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const signup = async (req, res) => {
  // console.log(req.body);
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
      ipAddr,
      browserInfo,
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

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password not matched",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: name,
      email,
      mobile,
      password: hashedPassword,
      salt: salt,
      isEmailVerified: false,
      ipAddr,
      browserInfo: browserInfo.ua,
      roleId: 2,
    });

    const adminRole = await Role.findOne({ where: { name: "Admin" } });
    await UserRole.create({
      userId: user.id,
      roleId: adminRole.id,
      branchId: null,
    });

    await sendVerificationEmail(email, user.id);

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

const requestOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { mobile: identifier }],
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await user.update({ otp, otp_expiry: otpExpiry });

    if (user.email === identifier) {
      await sendOtpEmail(user.email, otp);
    } else {
      await sendOtpSMS(user.mobile, otp);
    }

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const verificationRecord = await Token.findOne({
      where: {
        token: token,
        isActive: true,
        expiresAt: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!verificationRecord) {
      return res.redirect(
        `${process.env.UI_URL}/email-verified?success=false&message=Invalid or expired verification token`
      );
    }

    const user = await User.findOne({
      where: { id: verificationRecord.userId },
    });

    if (!user) {
      return res.redirect(
        `${process.env.UI_URL}/email-verified?success=false&message=User not found`
      );
    }

    user.isEmailVerified = true;
    await user.save();

    await Token.update(
      { isActive: false },
      { where: { id: verificationRecord.id } }
    );

    return res.redirect(
      `${process.env.UI_URL}/email-verified?success=true&message=Email verified successfully`
    );
  } catch (error) {
    console.error(error);
    return res.redirect(
      `${process.env.UI_URL}/email-verified?success=false&message=An unexpected error occurred`
    );
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { mobile: identifier }],
        otp,
        otp_expiry: {
          [Op.gte]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    user.update({ otp: null, otp_expiry: null });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered",
      });
    }

    await sendPasswordResetEmail(email, user.id);

    return res.status(200).json({
      success: true,
      message: "Link send",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.query;

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.userId;

    const resetPasswordDetails = await Token.findOne({
      where: {
        token: token,
        isActive: true,
        expiresAt: {
          [Op.gt]: new Date(), // Check that the token has not expired
        },
      },
    });

    if (!resetPasswordDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or expires",
      });
    }

    const userId = resetPasswordDetails.userId;

    const existingUser = await User.findByPk(userId);

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not exist",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.update(
      { password: hashedPassword, salt: salt, isEmailVerified: true },
      { where: { id: userId } }
    );

    await Token.update(
      { isActive: false },
      { where: { id: resetPasswordDetails.id } }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An unexpected error occurred.",
      error: error.message,
    });
  }
};

const sendEmailVerification = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    await sendVerificationEmail(email, user.id);

    return res.status(200).json({
      success: true,
      message: "verification email sent successful",
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
  login,
  signup,
  requestOtp,
  verifyOtp,
  resetPassword,
  forgotPassword,
  verifyEmail,
  sendEmailVerification,
};
