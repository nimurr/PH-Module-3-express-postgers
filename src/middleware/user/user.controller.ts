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


export const userController = {
    createUser
}