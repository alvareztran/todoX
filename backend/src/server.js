import express from "express";
import dotenv from "dotenv";
import tasksRoutes from "./routes/tasksRoutes.js";
import connectDb from "./config/db.js";
import cors from "cors";
import path, { dirname } from "path";

const __dirname = path.resolve();

const app = express();
app.use(express.json());
dotenv.config();

app.use("/api/tasks", tasksRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(process.env.PORT, () => {
  connectDb();
  console.log(`Server is running on port ${process.env.PORT}`);
});
