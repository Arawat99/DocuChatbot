import mongoose from "mongoose";
import "dotenv"


export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB Connected")
    }catch (error) {
        console.error("Mongo DB Connection Error: ", error)
        process.exit(1)
    }
};