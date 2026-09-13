import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@userinfo.44bs2n7.mongodb.net/?appName=UserInfo`;

  if (!process.env.MONGO_DB_USERNAME || !process.env.MONGO_DB_PASSWORD) {
    throw new Error("MongoDB username or password is missing");
  }

  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;