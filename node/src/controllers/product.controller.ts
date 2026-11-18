import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product.service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/bodyparser";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;
    const product = productService();
    const urlParams = url?.split("/");

    const uniqueId =
        urlParams && urlParams[1] === "products" && urlParams[2]
            ? Number(urlParams[2])
            : null;
    if (url === "/products" && method === "GET") {
        try {
            const products = productService();
            sendResponse(
                res,
                true,
                200,
                "products retrived successfull.",
                products,
            );
        } catch (error) {
            sendResponse(res, false, 500, "internal server error");
        }
    } else if (
        method === "GET" &&
        uniqueId !== null &&
        Number.isInteger(uniqueId) &&
        uniqueId > 0
    ) {
        const products = productService();
        const product = products.find((p: IProduct) => p.id === uniqueId);
        res.writeHead(200, {
            "content-type": "application/json",
        });
        res.end(
            JSON.stringify({
                message: "unique product recieve successfull.",
                data: product,
            }),
        );
    } else if (url === "/products" && method === "POST") {
        const body = await bodyParser(req);
        console.log(body);

        // new creat product
        const newProduct = {
            id: Date.now(),
            ...body,
        };

        const products = productService();
        products.push(newProduct);
        createProduct(products);

        res.writeHead(201, {
            "content-type": "application/json",
        });
        res.end(
            JSON.stringify({
                message: "product created successfull.",
                data: newProduct,
            }),
        );
    } else if (url === "PUT" && uniqueId !== null) {
        const body = await bodyParser(req);
        const products = productService();

        const index = products.findIndex((p: IProduct) => p.id === uniqueId);
        if (index < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(
                JSON.stringify({
                    message: "Product not found",
                }),
            );
        }
        products[index] = { id: products[index].uniqueId, ...body };
        createProduct(products);
        res.writeHead(201, { "content-type": "application/json" });
        res.end(
            JSON.stringify({
                message: "update product successfuly.",
                data: products[index],
            }),
        );
    } else if (method === "DELETE" && uniqueId !== null) {
        const products = productService();

        const findProduct = products.findIndex(
            (p: IProduct) => p.id === uniqueId,
        );

        if (findProduct < 0) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(
                JSON.stringify({
                    message: "Product not found",
                }),
            );
            return;
        }

        // Delete product from array
        const deletedProduct = products.splice(findProduct, 1);

        // Save updated products
        createProduct(products);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(
            JSON.stringify({
                message: "Product deleted successfully.",
                data: deletedProduct[0],
            }),
        );
    }
};

export default productController;
