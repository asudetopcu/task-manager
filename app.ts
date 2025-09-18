import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.ts";


export const app = express(); 
app.use(express.json());

app.use("/api", authRoutes);

(async () => {
    const MONGO_URI = process.env.MONGO_URI;
    const PORT = process.env.PORT;

    if (!MONGO_URI) throw new Error("MONGO_URI missing");

    await mongoose.connect(MONGO_URI)
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (err: any) => {
        console.error("MongoDB error: ",err);
    })
    app.listen(PORT, () => {   
        console.log(`Server running on https://localhost:${PORT}`); 
    })
})();

