const express=require("express");
const router=express.Router();
const {
    registerUser,
    loginUser,
    checkphone,
    checkemail,
    forgotPassword
}=require("../controllers/authController");
// const {protect}=require("../middleware/authMiddleware");
router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/check-phone",checkphone);
router.get("/check-email",checkemail);
router.post("/forgot-password",forgotPassword);
module.exports=router;