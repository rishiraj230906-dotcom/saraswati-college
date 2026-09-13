const express=require("express");
const router=express.Router();
const {
    registerUser,
    loginUser,
    checkPhone,
    checkEmail,
    forgotPassword
}=require("../controllers/authController");
// const {protect}=require("../middleware/authMiddleware");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/check-phone",checkPhone);
router.get("/check-email",checkEmail);
router.post("/forgot-password",forgotPassword);
module.exports=router;