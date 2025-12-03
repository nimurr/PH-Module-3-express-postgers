import express, { NextFunction, Request, Response } from "express";

import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todosRoutes } from "./modules/todo/todos.routes";
import { authRoutes } from "./modules/auth/auth.routes";

//!Basic Express Setup
const app = express();

app.use(express.json());

//!====== initializing DB ======
initDB()

//! ==== Home Testing Route ====
app.get("/", logger, (req: Request, res: Response) => {
    res.send("Hello Next Level Developers!");
});



//?======================== Start Routes ====================

//!======= todos crud =======
app.use('/auth', authRoutes)
//!==== All users CRUD ====
app.use("/users", userRoutes)

//!======= todos crud =======
app.use("/todos", todosRoutes)


//?======================= End Routes =======================


//!===== Not Found =====
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});




export default app