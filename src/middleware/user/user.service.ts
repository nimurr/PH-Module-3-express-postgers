import { pool } from "../../config/db";


const createUser = async (email: string, name: string) => {
    const result = await pool.query(
        `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
        [name, email]
    );

    return result.rows[0];
}

const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
}

const getUserById = async (id: number) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result.rows[0];
}

export const userService = {
    createUser,
    getUser,
    getUserById
}