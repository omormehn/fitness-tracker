import express, { Request, Response } from "express";
import { connectDB } from "./model/db";
import dotenv from 'dotenv'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import authRoutes from './routes/auth'
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error('MONGO_URI missing in env');
  process.exit(1);
}

app.use(express.json());
app.use(helmet())
app.use(cookieParser())
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});
app.use(limiter);

connectDB(MONGO_URI);


app.use('/api/auth', authRoutes);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
