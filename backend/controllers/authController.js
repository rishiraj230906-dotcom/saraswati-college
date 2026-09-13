const User =require("../models/User");
const generateToken =require("../utils/generateToken");
const sendEmail =require("../utils/sendemail");
exports.registerUser = async (req,res,next)=>{
    try{
        const {firstName,lastName,email,phone,password}=req.body;
        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role:"student"
        });
        const token = generateToken(user._id);
        await sendEmail({
            email: user.email,
            subject: "Welcome to Our Saraswati College",
            message: `<h1>Hello ${user.firstName},</h1><p>Thank you for registering on our platform!</p>`
        });
        user.password = undefined; // Hide password in response
        res.status(201).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};
exports.loginUser = async (req,res,next)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(new Error("The user with this email does not exist"));
        }
        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return next(new Error("Invalid credentials"));
        }
        const token = generateToken(user._id);
        user.password = undefined; // Hide password in response
        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};
exports.checkphone = async (req,res,next)=>{
    try{
        const {phone}=req.params;
        const user = await User.findOne({phone});
        if(user){
            return res.status(200).json({
                success: true,
                exists: true,
                message: "Phone number already exists"
            });
        }
        res.status(200).json({
            success: true,
            exists: false,
            message: "Phone number is available"
        });
    } catch (error) {
        next(error);
    }
};
exports.checkemail = async (req,res,next)=>{
    try{
        const {email}=req.params;
        const user = await User.findOne({email});
        if(user){
            return res.status(200).json({
                success: true,
                exists: true,
                message: "Email already exists"
            });
        }
        res.status(200).json({
            success: true,
            exists: false,
            message: "Email is available"
        });
    } catch (error) {
        next(error);
    }
};
exports.forgotPassword = async (req,res,next)=>{
    try{
        const {email,newPassword}=req.body;
        const user = await User.findOne({email});
        if(!user){
            return next(new Error("The user with this email does not exist"));
        }
        user.password = newPassword;
        await user.save();
        await sendEmail({
            email: user.email,
            subject: "Password Reset Successful",
            message: `<h1>Hello ${user.firstName},</h1><p>Your password has been reset successfully.</p>`
        });
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        next(error);
    }
};