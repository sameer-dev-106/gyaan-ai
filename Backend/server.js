import app from "./src/app.js";
import connectDB from "./src/config/database.js";

import http from "http";
import { initSocket } from "./src/socket/server.socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

initSocket(httpServer);

connectDB();

httpServer.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
});