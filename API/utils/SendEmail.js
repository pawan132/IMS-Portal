const mailSender = require("../config/nodemailer");
const Token = require("../models/Token");
const crypto = require("crypto");
const {
  createVerifyEmailTemplate,
} = require("../templates/VerifyEmailTemplate");
const {
  invitationEmailTemplate,
} = require("../templates/invitationEmailTemplate");
const { createPasswordResetTemplate } = require("../templates/resetPasswordTemplate");

require("dotenv").config();

const sendVerificationEmail = async (email, userId) => {
  const token = crypto.randomBytes(20).toString("hex");
  const expiresAt = Date.now() + 600000;

  await Token.create({
    userId,
    token: token,
    expiresAt,
  });

  const link = `${process.env.API_URL}/auth/verify-email/${token}`;
  const subject = "Email Verification";
  const html = createVerifyEmailTemplate(link);

  return (response = await mailSender(email, subject, html));
};

const sendPasswordResetEmail = async (email, userId) => {
  const token = crypto.randomBytes(20).toString("hex");
  const resetPasswordExpires = Date.now() + 6000000;

  await Token.create({
    userId: userId,
    token: token,
    expiresAt: resetPasswordExpires,
  });

  const link = `${process.env.UI_URL}/reset-password/${token}`;
  const subject = "Password Reset";
  const html = createPasswordResetTemplate(link);

  return (response = await mailSender(email, subject, html));
};

const sendInvitationEmail = async (email, userId, name) => {
  const token = crypto.randomBytes(20).toString("hex");
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  await Token.create({
    userId,
    token: token,
    expiresAt,
  });

  const link = `${process.env.UI_URL}/invitation/${token}`;
  const subject = "Registration Invitation";
  const html = invitationEmailTemplate(name, link);

  return (response = await mailSender(email, subject, html));
};

module.exports = {
  sendVerificationEmail,
  sendInvitationEmail,
  sendPasswordResetEmail,
};
