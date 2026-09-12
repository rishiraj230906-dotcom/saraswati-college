const express=require('express');
const router=express.Router();
const {
    sendOtpforRegister,
    verifyOtp,
    sendOtpforresetPassword
}=require('../controllers/otpController');
router.post('/send-otp-register',sendOtpforRegister);
router.post('/verify-otp',verifyOtp);
router.post('/send-otp-reset-password',sendOtpforresetPassword);
module.exports=router;