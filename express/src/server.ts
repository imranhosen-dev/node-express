import express, {
    type Application,
    type Request,
    type Response,
} from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_POOLED,
});

// initial db

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                age INT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("Database connected and table initialized");
    } catch (error) {
        console.error("Database initialization error:", error);
        throw error;
    }
};
initDB();

app.post("/api/v1/users", async (req: Request, res: Response) => {
    try {
        const { name, email, password, age } = req.body;
        const result = await pool.query(
            `
    INSERT INTO users (name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
            `,
            [name, email, password, age],
        );
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
});

// get user

app.get("/api/v1/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
            `);
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
});

// get unique user

app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `
                SELECT * FROM users WHERE id=$1

            `,
            [id],
        );
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
});

// update user api

app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, password, age, is_active } = req.body;
        const result = await pool.query(
            `
            UPDATE users SET
            name = COALESCE($1, name),
            password = COALESCE($2, password),
            age = COALESCE($3, age),
            is_active = COALESCE($4, is_active),
            updated_at = NOW(),
            WHERE id=$5 RETURNING *
            `,
            [
                name ?? null,
                password ?? null,
                age ?? null,
                is_active ?? null,
                id,
            ],
        );

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
});

app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
});
