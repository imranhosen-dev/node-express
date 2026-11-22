import { Pool } from "pg";
import config from "../config/index.js";

export const pool = new Pool({
    connectionString: config.connection_string
});

export const initDB = async () => {
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

