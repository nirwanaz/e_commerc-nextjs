import User from "../models/user";
import fs from "fs";
import { uploads } from "../utils/cloudinary";
import bcrypt from "bcryptjs";
import { log } from "console";
import ErrorHandler from "../utils/errorHandler";
import APIFilters from "../utils/APIFIlters";

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

export const getUsers = async (req, res) => {
    const resPerPage = 2;
    const usersCount = await User.countDocuments();

    const apiFilters = new APIFilters(User.find(), req.query).pagination(
        resPerPage
    );

    const users = await apiFilters.query;

    res.status(200).json({
        usersCount,
        resPerPage,
        users,
    });
}

export const getUser = async (req, res, next) => {
    const userId = req.query.id;

    if (!userId) {
        return next(new ErrorHandler({
            message: "Invalid User ID",
            statusCode: 400,
        }));
    }

    let user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler({
            message: "No User found with this ID",
            statusCode: 404,
        }));
    }

    res.status(200).json({
        success: true,
        user,
    })
}

export const updateUser = async (req, res, next) => {
    const userId = req.query.id;

    if (!userId) {
        return next(new ErrorHandler({
            message: "Invalid User ID",
            statusCode: 400,
        }));
    }

    let user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler({
            message: "No User found with this ID",
            statusCode: 404,
        }));
    }

    user = await User.findByIdAndUpdate(userId, req.body.userData);

    res.status(200).json({
        success: true,
        user,
    })
}

export const deleteUser = async (req, res, next) => {
    const userId = req.query.id;

    if (!userId) {
        return next(new ErrorHandler({
            message: "Invalid User ID",
            statusCode: 400,
        }));
    }

    let user = await User.findById(userId);

    if (!user) {
        return next(new ErrorHandler({
            message: "No User found with this ID",
            statusCode: 404,
        }));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
    })
}