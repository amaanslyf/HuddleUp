import express from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import {connectToSocket} from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);    // creating http server of express 
const io = connectToSocket(server);       // creating socket server of http server

app.set("port",(process.env.PORT || 8000));  
app.use(cors());  // for cors
app.use(express.json({limit:"40kb"}));  // for parsing application/json
app.use(express.urlencoded({limit:"40kb",extended:true})); // for parsing application/x-www-form-urlencoded    

const start =async ()=>{

    app.set("mongo_user")
    const connectionDb= await mongoose.connect("mongodb+srv://amaanslyf:Sandhuk%4024@huddleup.u4v3cnd.mongodb.net/?retryWrites=true&w=majority&appName=HuddleUp");

    if(connectionDb){
        console.log("Database connected");
    }
    
    server.listen(app.get("port"), () => {
        console.log(`Server started on port ${app.get("port")}`);
    });
}
start();