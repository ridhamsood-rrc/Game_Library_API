// import express, and its type
import express, {Express} from "express";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import userSetupSwagger from "../config/swagger";
import userRoutes from "../src/api/v1/routes/userRoutes";
import gameRoutes from "./api/v1/routes/gameRoutes"
import setupSwagger from "../config/gameSwaggerConfig";

// Initialize the express application
const app: Express = express();

// logs the request
app.use(morgan("combined"))

// parse json values automatically from the request body
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Response to request");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/games/", gameRoutes)

setupSwagger(app);
userSetupSwagger(app);

export default app;