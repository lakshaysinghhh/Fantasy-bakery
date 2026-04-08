import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1); // force crash
  }
};

export default connectDB;