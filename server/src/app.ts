import express from "express";
import mongoose from "mongoose";
import artistRoutes from "./routes/artistRoutes";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/artists", artistRoutes);

const PORT = process.env.PORT || 5000;

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

export default app;
