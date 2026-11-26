import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserDB(req.body);
        res.json({
            statusCode: 201,
            message: "user create successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

 
const getAllUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUserDB();
        res.status(200).json({
            success: true,
            message: "users retrived successfully",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSingleUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userService.getSingleUserDB(id as string);
        res.status(200).json({
            success: true,
            message: "unique user retrived successfully.",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userService.updateUserDB(req.body, id as string);

        res.status(200).json({
            success: true,
            message: "user update successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await userService.deleteUserDB(id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "user not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User Delete successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
};
