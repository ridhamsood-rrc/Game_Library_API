// import express, and its type
import express, {Express} from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

// Initialize the express application
const app: Express = express();

// logs the request
app.use(morgan("combined"))

// parse json values automatically from the request body
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Response to request");
});

export default app;