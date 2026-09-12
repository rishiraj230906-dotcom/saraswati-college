const User =require("../models/User");
const generateToken =require("../utils/generateToken");
const sendEmail =require("../utils/sendemail");
exports.registerUser = async (req,res,next)=>{
    try{
        const {firstName,lastName,email,password}=req.body;
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role:"student"
        });
        const token = generateToken(user._id);
        await sendEmail({
            email: user.email,
            subject: "Welcome to Our Saraswati College",
            message: `<h1>Hello ${user.firstName},</h1><p>Thank you for registering on our platform!</p>`
        });
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
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return next(new Error("Invalid credentials"));
        }
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
            user
        });
    } catch (error) {
        next(error);
    }
};