import express, { Request, Response } from 'express'
import { Pool } from "pg";

const app = express()
const port = 5000

//? use Parser for json data
app.use(express.json())
//? use Parser for fromData 
app.use(express.urlencoded())

//? DB connection
const pool = new Pool({
    connectionString: `postgresql://neondb_owner:npg_CA0znicZS1aO@ep-cool-butterfly-ah673s9y-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        age INT , 
        address TEXT,
        create_at TIMESTAMP DEFAULT NOW(),
        update_at TIMESTAMP DEFAULT NOW(),
        password VARCHAR(50) NOT NULL
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

app.post("/user", (req: Request, res: Response) => {
    console.log(req.body)
    res.status(201).json({
        code: 201,
        status: "success",
        message: "user created successfully",
        data: req.body
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
