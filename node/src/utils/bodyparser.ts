import type { IncomingMessage } from "http";

export const bodyParser = (req: IncomingMessage): Promise<unknown> => {
    let body = "";
    return new Promise((resolve, reject) => {
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            if (!body.trim()) {
                resolve(null);
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(error);
            }
        });
        req.on("error", (error) => {
            reject(error);
        });
    });
};
