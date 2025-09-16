import express, { Request, Response } from "express";
import { connectDB } from "./model/db";
import dotenv from 'dotenv'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Server is running with TypeScript!");
});




app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  connectDB(mongoUri!)
});
