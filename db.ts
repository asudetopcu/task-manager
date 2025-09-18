import mongoose from "mongoose";

async function connectDB(uri: any) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ MongoDB bağlantısı kuruldu");
}

module.exports = { connectDB };