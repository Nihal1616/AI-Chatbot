import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import ChatRoutes from './routes/chat.js'
dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use("/api",ChatRoutes);



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT} `);
  connectDB();
});

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to Databse")
    }catch(err){
        console.log(err);
    }
}

