import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

export const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const header = req.headers.authorization;

            if (!header || !header.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: No token provided",
                });
            }

            const token = header.split(" ")[1]; // <-- Extract real token

            const decoded = jwt.verify(token as string, config.jwt_secret) as JwtPayload;

            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid token",
                });
            }

            // attach decoded user info
            req.user = decoded;


            // role-based access check
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You do not have permission",
                });
            }

            next();
        } catch (error: any) {
            console.log(error);

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token expired" });
            }

            return res.status(401).json({
                success: false,
                message: "Invalid or malformed token",
            });
        }
    };
};
