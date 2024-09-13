import express from "express";
import mongoose from "mongoose";
import { artistRouter } from "./routes/artistRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler } from "./errorHandler";
import { createClient } from "redis";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(errorHandler);
app.use("/api/artists", artistRouter);

const PORT = process.env.PORT || 5000;

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Redis connection error:", err);
  });

client.on("error", (err: Error) => console.error("Redis Client Error", err));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", (error as Error).message);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { client as redisClient };
export default app;
