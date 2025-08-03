import express from "express";
import {createServer} from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/user.routes.js";
import {connectToSocket} from "./controllers/socketManager.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port",(process.env.PORT || 8000));
app.use(cors({ origin: "https://huddle-up-lilac.vercel.app/" }));
app.use(express.json({limit:"40kb"}));   //The limit option specifies the maximum size of the request body in bytes.
app.use(express.urlencoded({limit:"40kb",extended:true}));  

app.use("/api/v1/users",userRoutes);

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully.");

        server.listen(app.get("port"), () => {
            console.log(`Server started on port ${app.get("port")}`);
        });

    } catch (error) {
        console.error("!!! FAILED TO START SERVER !!!");
        console.error(error);
        process.exit(1); 
    }
}

start();