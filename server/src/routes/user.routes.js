import {Router} from "express";
import { 
    register, 
    login, 
    logout, 
    sendVerifyOtp, 
    verifyEmail, 
    isAuthenticated, 
    sendResetOtp,
    resetPassword,
    getUserData
} from "../controllers/user.controllers.js";
import { authentication } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/send-verify-otp").post(authentication, sendVerifyOtp);
router.route("/verify-account").post(authentication, verifyEmail);
router.route("/is-auth").get(authentication, isAuthenticated);
router.route("/send-reset-otp").post(sendResetOtp);
router.route("/reset-password").post(resetPassword);
router.route("/profile").get(authentication, getUserData);

export default router;