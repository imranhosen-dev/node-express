import * as http from "node:http";
import {createServer, type Server} from "node:http";
import routeHandler from "./routes/route";


const server: Server = createServer((request, response)=>{
    routeHandler(request, response)
})

server.listen(5000, () => {
    console.log('server is running now')
})

