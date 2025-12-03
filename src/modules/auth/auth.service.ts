import { pool } from "../../config/db"
import bycrpt from "bcryptjs"
// var jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken"
import config from "../../config"

const loginUser = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])

    if (result.rows.length === 0) {
        throw new Error('User not found')
    }

    const user = result.rows[0]

    const matchPass = await bycrpt.compare(password, user.password)

    if (!matchPass) {
        throw new Error('Invalid password')
    }

    delete user.password

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, config.jwt_secret, { expiresIn: '7d' })

    console.log(token)

    const results = {
        token,
        user: result.rows
    }

    return results
}

export const authService = {
    loginUser
}