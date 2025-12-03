import { pool } from "../../config/db";
import bcrypt from "bcryptjs";


const createUser = async (email: string, name: string, password: string, role: string) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(name, email , password , role) VALUES($1, $2 , $3 , $4) RETURNING *`,
        [name, email, passwordHash, role]
    );

    return result.rows;
}

const getUser = async () => {
    const result = await pool.query(`SELECT * FROM users`);
    return result.rows;
}

const getUserById = async (id: number) => {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    console.log(result)
    return result.rows;
}

const updateUser = async (id: number, email: string, name: string) => {
    const result = await pool.query(
        `UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *`,
        [email, name, id]
    );
    return result.rows[0];
}

const deleteUser = async (id: number) => {
    const results = await pool.query(`DELETE FROM users WHERE id = $1`, [
        id,
    ]);

    return results;
}

export const userService = {
    createUser,
    getUser,
    getUserById,
    updateUser,
    deleteUser
}