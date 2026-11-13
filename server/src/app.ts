import express  from "express";
import { success } from "zod";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TeamOS API is running",
    });
});

export default app;