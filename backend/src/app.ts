import express from "express";
import cors from "cors"

import authRoutes from "./Auth/auth.routes.js";
import conversationRoutes from "./Chat/conversation.routes.js";


const app = express();

app.use(express.json());
app.use(
    cors({
        origin: "*"
    })
)
app.use("/auth", authRoutes);
app.use("/conversations", conversationRoutes);



export default app;