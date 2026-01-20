import mongoose from "mongoose";


const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@userinfo.44bs2n7.mongodb.net/?appName=UserInfo`;


if (!connectionString) {
throw new Error("Provide a valid MongoDB connection string");
}


const connectDB = async () => {
if (mongoose.connection.readyState >= 1) return;


try {
await mongoose.connect(connectionString);
} catch (error) {
console.error("MongoDB connection error:", error);
}
};


export default connectDB;