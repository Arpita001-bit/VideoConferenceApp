import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManagement.js";
import httpStatus from 'http-status';
import 'dotenv/config';

import cors from "cors";
import userRoutes from "./routes/users.routes.js"


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port" , (process.env.PORT||8000))
app.use(cors());
app.use(express.json({limit:"40kb",extended:true}));
app.use("/api/v1",userRoutes);



// app.get("/",(req,res)=>{
//      res.send({"hello":"world"})
// });
app.get("/home", (req, res) => {
    return res.json({ hello: "world" });
});

const start = async () => {
    app.set("mongo_user")

    const connectionDB = await mongoose.connect("mongodb+srv://bouriarpita05_db_user:vediochatpassword@cluster0.cznz5h4.mongodb.net/")
    
    console.log(`MONGO CONNECTED DB HOST:${connectionDB.connection.host}`)
    server.listen(app.get("port"),()=>{
        console.log("LISTENING TO PORT");
    });
    
}

start();