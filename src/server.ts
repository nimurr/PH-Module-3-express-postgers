import express, { Request, Response } from 'express'
import { Pool } from "pg";

//! import dotenv
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = process.env.PORT || 5001

//! use Parser for json data
app.use(express.json())
//? use Parser for fromData 
app.use(express.urlencoded())

//! DB connection
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
})

//!========== DB Intergace Here ===========
const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL UNIQUE,
        age INT , 
        address TEXT,
        password VARCHAR(50) NOT NULL,
        create_at TIMESTAMP DEFAULT NOW(), 
        update_at TIMESTAMP DEFAULT NOW()
        )
        `)
    await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            isComplete BOOLEAN DEFAULT false,
            create_at TIMESTAMP DEFAULT NOW(),
            update_at TIMESTAMP DEFAULT NOW()
        )
        `)
}
initDB()

//!========== Middleware ===========

const logger = (req: Request, res: Response, next: any) => {
    console.log(`[${new Date().toISOString()}]  METHOD:"${req.method}"  PATH:"${req.path}"`)
    next()
}


//!========== Routes ===========

//? get Test Server
app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Next level ts Developer!')
})


//!========== Here All users CRUD operation =========
//?------------ create user -----------------
app.post("/users", logger, async (req: Request, res: Response) => {

    const { name, email, age, address, password } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO users(name, email, age, address, password) 
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
            ` , [name, email, age, address, password])

        console.log(result.rows[0])

        res.send({
            code: 201,
            status: "success",
            message: "user created successfully",
            data: result.rows[0]
        })


    } catch (error: any) {
        console.log(error)
        return res.status(400).json({
            code: 400,
            status: "error",
            message: error.message,
        })
    }

})
//?------------ get all users ---------------
app.get('/users', logger, async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM users")
        res.status(200).json({
            code: 200,
            status: "success",
            data: result.rows
        })
    } catch (error) {
        console.log(error)
    }
})
//? get single user
app.get('/users/:id', logger, async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        res.status(200).json({
            code: 200,
            status: "success",
            data: result.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
})

//? Update single user 
app.put('/users/:id', logger, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, age, address, password } = req.body;
    try {
        const result = await pool.query("UPDATE users SET name = $1, email = $2, age = $3, address = $4, password = $5 WHERE id = $6 RETURNING *", [name, email, age, address, password, id])

        res.status(200).json({
            code: 200,
            status: "success",
            data: result.rows[0]
        })
    } catch (error) {
        console.log(error)
    }
})

//? Delete single user
app.delete('/users/:id', logger, async (req: Request, res: Response) => {
    const { id } = req.query;
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1
            RETURNING *
            `, [id])
        if (result.rowCount === 0) {
            return res.status(404).json({
                code: 404,
                status: "error",
                message: "user not found"
            })
        }
        else {
            res.status(200).json({
                code: 200,
                status: "success",
                message: "user deleted successfully",
                data: result.rows[0]
            })
        }
    } catch (error: any) {
        console.log(error)
        res.status(400).json({
            code: 400,
            status: "error",
            message: error.message
        })
    }
})



//!======== Not Found Routes =========
app.use((req: Request, res: Response) => {
    res.status(404).json({
        code: 404,
        status: "error",
        message: "Route not found",
        path: req.url
    })
})

//!========== Start Server ===========
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
