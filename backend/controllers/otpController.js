const otp=require('../models/Otp');
const sendEmail=require('../utils/sendemail');
const generateOtp=()=>Math.floor(100000+Math.random()*900000);
exports.sendOtpforRegister=async(req,res,next)=>{
    try{
        const {email}=req.body;
        const otpData=await otp.create({
            email,
            otp: generateOtp(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP expires in 5 minutes
        });
        await sendEmail({
            email: otpData.email,
            subject: "Your OTP for registering at Saraswati College",
            message: `<h1>Your OTP Code is: ${otpData.otp}</h1>`
        });
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        next(error);
    }
};
exports.verifyOtp=async(req,res,next)=>{
    try{
        const {email,otp}=req.body;
        const otpData=await otp.findOne({email,otp,expiresAt:{$gt:new Date()}});
        if(!otpData){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        await otp.deleteOne({_id:otpData._id});
        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });
    } catch (error) {
        next(error);
    }
};
exports.sendOtpforresetPassword=async(req,res,next)=>{
    try{
        const {email}=req.body;
        const otpData=await otp.create({
            email,
            otp: generateOtp(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP expires in 5 minutes
        });
        await sendEmail({
            email: otpData.email,
            subject: "Your OTP for resetting password at Saraswati College",
            message: `<h1>Your OTP Code is: ${otpData.otp}</h1>`
        });
        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        next(error);
    }
};