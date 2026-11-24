// login user functionality

import type { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserDB(req.body);
        console.log(result);
        res.status(200).json({
            success: true,
            message: 'user login successfully.',
            data:result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message,
            error: error,
        });
    }
};

export const authController = {
    loginUser,
};
