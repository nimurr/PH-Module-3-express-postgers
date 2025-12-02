import express, { NextFunction, Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./middleware/user/user.routes";
import { todosRoutes } from "./middleware/todo/todos.routes";

//!Basic Express Setup
const app = express();
const port = config.port;
app.use(express.json());

//!====== initializing DB ======
initDB()

//! ==== Home Testing Route ====
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});



//?======================== Start Routes ====================

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

//!===== Server Running =====
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
