import app from "./app";

// import HTTP server
import { Server } from "http";

// initialize our port
const PORT: string | number = process.env.PORT || 3000;

// initialize the server for this app to listen on the PORT
const server: Server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

export default server;