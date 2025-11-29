import express, { Request, Response } from 'express'
import { Pool } from "pg";

//? import dotenv
import dotenv from "dotenv"
dotenv.config()

const app = express()
const port = process.env.PORT || 5001

//? use Parser for json data
app.use(express.json())
//? use Parser for fromData 
app.use(express.urlencoded())

//? DB connection
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
})

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


//? Routes 

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Next level ts Developer!')
})

app.post("/users", async (req: Request, res: Response) => {

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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
