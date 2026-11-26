import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import dotenv from "dotenv";
import fs from "fs";
import { userRoute } from "./modules/users/user.route.js";
import { profileRoute } from "./modules/profile/profile.route.js";
import { authRoute } from "./modules/auth/auth.route.js";
import logger from "./middleware/logger.js";
dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger)

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "This is main route",
        author: "imrannazirmim",
    });
});

export default app;

