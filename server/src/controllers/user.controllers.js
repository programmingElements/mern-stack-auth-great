import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.models.js";
import { sendVerificationEmail } from "../utils/sender.js";

const register = asyncHandler(async (req, res, next) => {
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            throw new ApiError(400, "All fields are required.");
        }

        const user = await User.findOne({email});

        if (user) {
            throw new ApiError(400, "User already exists.");
        }

        const createdUser = await User.create({
            name,
            email,
            password
        });

        const existedUser = await User.findById(createdUser._id).select("-password -__v");

        if (!existedUser) {
            throw new ApiError(400, "User creation failed.");
        }

        const token = createdUser.generateAccessToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        const data = await sendVerificationEmail(
            email, 
            "Welcome to GreatStack", 
            `<h2>Welcome to greatstack website.</h2> <p>Your account has been created with email id: ${email}</p>`
        );

        return res.status(201).json(
            new ApiResponse(201, existedUser, "User created successfully!")
        );

    } catch (error) {
        throw new ApiError(error?.statusCode || 500, error.message);
    }
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            throw new ApiError(400, "All fields are required.");
        }

        const user = await User.findOne({email});

        if (!user) {
            throw new ApiError(404, "User doesn't found.");
        }

        const isCorrectPassword = await user.comparePassword(password);

        if (!isCorrectPassword) {
            throw new ApiError(400, "Invalid Credentials.");
        }

        const token = user.generateAccessToken();

        res
        .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User loggedIn successfully!")
        );


    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

const logout = asyncHandler(async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });

        return res.status(200).json(
            new ApiResponse(200, {}, "User logout successfully!")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// Send verification OTP to user's email
const sendVerifyOtp = asyncHandler(async (req, res, next) => {
    try {
        const {userId} = req.body;

        if (!userId) {
            throw new ApiError(400, "Missing user id");
        }

        const user = await User.findById(userId).select("-password -__v");

        if (!user) {
            throw new ApiError(404, "User doesn't existed.");
        }

        if (user.isAccountVerified) {
            throw new ApiError(400, "Account already verified.");
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const data = await sendVerificationEmail(
            user.email, 
            "Account Verification OTP",
            `
            <p> Your One Time Password. <p>
            <h2> ${otp} </h2>
            <p> Verify your account using this OTP. </p>
            `
        );

        return res.status(200).json(
            new ApiResponse(200, {user, data}, "Verification OTP Sent on Email.")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// Verify the Email using the OTP
const verifyEmail = asyncHandler(async (req, res, next) => {
    try {
        const {userId, otp} = req.body;

        if (!userId || !otp) {
            throw new ApiError(400, "Missing Details.");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User doesn't existed.");
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            throw new ApiError(400, "Invalid OTP.");
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            throw new ApiError(400, "OTP Expired.");
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user, "Email verified successfully!")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// Check if user is authenticated
const isAuthenticated = asyncHandler(async (req, res, next) => {
    try {
        
        const {userId} = req.body;

        if (!userId) {
            throw new ApiError(400, "Missing the userId.");
        }

        const user = await User.findById(userId).select("-password -__v -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt");

        if (!user) {
            throw new ApiError(404, "User doesn't exists.");
        }

        return res.status(200).json(
            new ApiResponse(200, user, "User is Authenticated!")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// Send Password Reset OTP
const sendResetOtp = asyncHandler(async (req, res, next) => {
    try {
        const {email} = req.body;

        if (!email) {
            throw new ApiError(400, "Missing the email.");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User doesn't existed.");
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const data = await sendVerificationEmail(
            user.email, 
            "Reset Password OTP", 
            `
            <p>Reset Your Password</p>
            <h3>${otp}</h3>
            <p>Use this OTP to proceed with resetting your password.</p>
            `);
        
        return res.status(200).json(
            new ApiResponse(200, {user, data}, "OTP Sent to your email.")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

// Reset User Password
const resetPassword = asyncHandler(async (req, res, next) => {
    try {
        const {email, otp, newPassword} = req.body;

        if (!email || !otp || !newPassword) {
            throw new ApiError(400, "Missing the Email, OTP and new Password details.");
        }

        const user = await User.findOne({email});

        if (!user) {
            throw new ApiError(404, "User doesn't existed.");
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            throw new ApiError(400, "Invalid OTP.");
        }

        if (user.resetOtpExpireAt < Date.now()) {
            throw new ApiError(400, "OTP Expired.");
        }

        user.password = newPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json(
            new ApiResponse(200, user, "Password has been updated successfully!")
        );

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message || "Something went wrong.");
    }
});

const getUserData = asyncHandler(async (req, res, next) => {
    try {
        const {userId} = req.body;

        const user = await User.findById(userId).select("-password -__v -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt");

        if (!user) {
            throw new ApiError(404, "User doesn't existed.");
        }

        return res.status(200).json(
            new ApiResponse(200, user, "Got user data!")
        );
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }
});

export {register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, getUserData};