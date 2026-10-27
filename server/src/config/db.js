import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
  });
  console.log("MongoDB connected");
}
