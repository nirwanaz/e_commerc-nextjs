import User from "../models/user";
import fs from "fs";
import { uploads } from "../utils/cloudinary";
import bcrypt from "bcryptjs";
import { log } from "console";
import ErrorHandler from "../utils/errorHandler";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
    });

    res.status(201).json({
        user,
    });
};

export const updateProfile = async (req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        avatar: { public_id: '', url: '' },
    }

    // log("file", req.files);

    if (req.files.length > 0) {
        const uploader = async (path: string) => {
            try {
                return await uploads(path, "buyitnow/avatars");    
            } catch (error) {
                return undefined
            }
        };

        const file = req.files[0];
        const { path } = file;

        const avatarResponse = await uploader(path);

        if (avatarResponse) {
            newUserData.avatar = avatarResponse;
            fs.unlinkSync(path);
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData);

    res.status(200).json({
        user
    });
}

export const updatePassword = async (req, res) => {
    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatched = await bcrypt.compare(
        req.body.currentPassword,
        user.password
    );

    if (!isPasswordMatched) {
        throw new ErrorHandler({ message: "Old password is incorrect", statusCode: 400 });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({
        success: true,
    })
}