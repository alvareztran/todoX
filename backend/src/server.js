import express from 'express';
import dotenv from 'dotenv';
import tasksRoutes from './routes/tasksRoutes.js';
import connectDb from './config/db.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }))
dotenv.config();

app.use("/api/tasks", tasksRoutes);

app.listen(process.env.PORT, () => {
    connectDb();
    console.log(`Server is running on port ${process.env.PORT}`);
})


