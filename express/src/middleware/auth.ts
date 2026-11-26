import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    console.log("this is protected route");
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorization access",
        });
    }
    console.log(token);
    const decode = jwt.verify(token as string, config.jwt) as JwtPayload;
    console.log(decode);
    const user = await pool.query(
        `
    SELECT * FROM users WHERE email=$1
        `,
        [decode.email],
    );

    if (user.rowCount === 0) {
        res.status(404).json({
            success: false,
            message: "User not found!",
        });
    }
    if (!user.rows[0].is_active) {
        res.status(403).json({
            success: false,
            message: "Forbidden user",
        });
    }

    req.user = decode;
    console.log(req.user)
    next();
};

export default auth;
