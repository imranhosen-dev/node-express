import type { IncomingMessage, ServerResponse } from "node:http";
import productController from "../controllers/product.controller";

const routeHandler = (request: IncomingMessage, response: ServerResponse) => {
    const url = request.url;
    const method = request.method;

    if (url === "/" && method === "GET") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(
            JSON.stringify({
                message: "This route end time",
            }),
        );
    } else if (url?.startsWith("/products")) {
        productController(request, response);
    } else {
        response.writeHead(404, {
            "Content-Type": "application/json",
        });
        response.end(
            JSON.stringify({
                message: "This route is not defined",
            }),
        );
    }
};

export default routeHandler;
