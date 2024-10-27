const express = require("express");
const {
  login,
  signup,
  resetPassword,
  forgotPassword,
  verifyEmail,
  sendEmailVerification,
} = require("../controllers/AuthController");
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
// router.post('/request-otp', requestOtp);
// router.post('/verify-otp', verifyOtp);
router.put('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);
router.get('/verify-email/:token', verifyEmail);  
router.post('/send-email-verification/:email', sendEmailVerification);  

module.exports = router;