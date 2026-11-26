import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserDB = async (payload: { email: string; password: string }) => {
    // check user exit
    // check in the password match
    // check the user status
    // if the pass then generate jwt token match
    const { email, password } = payload;
    const user = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [email],    
    );
    if (user.rowCount === 0) {
        throw new Error("Invalid Credintials");
    }
    const matchPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!matchPassword) {
        throw new Error("password not match");
    }
    if (!user.rows[0].is_active) {
        throw new Error("Access denied!");
    }
    const jwtPayload = {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
    };
    const jwtAccessToken = jwt.sign(jwtPayload, config.jwt, {
        expiresIn: "1d",
    });
    return { jwtAccessToken, user: user.rows[0] };
};

export const authService = {
    loginUserDB,
};
