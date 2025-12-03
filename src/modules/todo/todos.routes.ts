import { Request, Response } from "express";
import { pool } from "../../config/db";

const express = require("express");
const router = express.Router();


router.post('/', async (req: Request, res: Response) => {
    const { user_id, title } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
            [user_id, title]
        );
        res.status(201).json({
            success: true,
            message: "Todo created",
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
        const result = await pool.query(`SELECT * FROM todos`);

        res.status(200).json({
            success: true,
            message: "todos retrieved successfully",
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
    try {
        const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
            req.params.id,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to fetch todo" });
    }
}
)

router.put('/:id', async (req: Request, res: Response) => {
    const { title, completed } = req.body;

    try {
        const result = await pool.query(
            "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
            [title, completed, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to update todo" });
    }
})

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            "DELETE FROM todos WHERE id=$1 RETURNING *",
            [req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }

        res.json({ success: true, message: "Todo deleted", data: null });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Failed to delete todo" });
    }
})



export const todosRoutes = router;