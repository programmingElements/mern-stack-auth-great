import express from "express";
import cors from "cors";
import cookierParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookierParser());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173"] || process.env.CROSSORIGIN
}));

import { errorHandler } from "./middlewares/error.middlewares.js";
import userRouter from "./routes/user.routes.js";

// healthcheck router
app.get("/", (req, res) => {
    return res.send("Health Check API Working!");
});

app.use("/api/v1/user", userRouter);


app.use(errorHandler);

export default app;