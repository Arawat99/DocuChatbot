import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";



dotenv.config();

const PORT = process.env.PORT;


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server Running on Port ${ PORT }`)
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();