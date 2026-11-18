import path from "path";
import fs from "fs";
import type { IProduct } from "../types/product";

const pathFile = path.join(process.cwd(), "./src/db/db.json");

export const productService = () => {
    console.log(process.cwd());
    console.log(pathFile);

    const readFile = fs.readFileSync(pathFile, "utf-8");
    console.log(readFile);
    return JSON.parse(readFile);
};

// create product
export const createProduct = (payload: IProduct[]) => {
    fs.writeFileSync(pathFile, JSON.stringify(payload));
};
