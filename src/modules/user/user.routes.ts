import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userController } from "./user.controller";
import logger from "../../middleware/logger";
import { auth } from "../../middleware/auth";

const express = require("express");
const router = express.Router();

router.post('/', userController.createUser)

router.get('/', logger, auth("admin" , "user"), userController.getUser)

router.get('/:id', userController.getUserById)

router.put('/:id', userController.updateUser)

router.delete('/:id', userController.deleteUser)

export const userRoutes = router;