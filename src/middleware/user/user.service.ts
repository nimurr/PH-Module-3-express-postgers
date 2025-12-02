import { pool } from "../../config/db";


const createUser = async (email: string, name: string) => {
    const result = await pool.query(
        `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
        [name, email]
    );

    return result.rows[0];
}

export const userService = {
    createUser
}