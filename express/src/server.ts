import app from "./app";
import config from "./config";

const main = async () => {
    app.listen(config.port, () => {
        console.log(`server is running ${config.port}`);
    });
};

main();

