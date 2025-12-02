import { Request, Response } from "express";
import { pool } from "../../config/db";

const express = require("express");
const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, email } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
            [name, email]
        );
        // console.log(result.rows[0]);
        res.status(201).json({
            success: false,
            message: "Data Instered Successfully",
            data: result.rows[0],
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})
router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM users`);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
            datails: err,
        });
    }
})
router.get('/:id', async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
            req.params.id,
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})
router.put('/:id', async (req: Request, res: Response) => {
    // console.log(req.params.id);
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
            [name, email, req.params.id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})
router.delete('/:id', async (req: Request, res: Response) => {
    // console.log(req.params.id);
    try {
        const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
            req.params.id,
        ]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result.rows,
            });
        }
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
})

export const userRoutes = router;