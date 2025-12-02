import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const result = await userService.createUser(email, name);

        res.status(201).json({
            success: false,
            message: "Data Instered Successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getUser();

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
}

const getUserById = async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await userService.getUserById(Number(req.params.id));

        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result,
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const userController = {
    createUser,
    getUser,
    getUserById
}