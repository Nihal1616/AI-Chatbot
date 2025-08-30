import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import ChatRoutes from './routes/chat.js'
import UserRoutes from './routes/user.route.js'
dotenv.config();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://ai-chatbot-1-h3vk.onrender.com"],
    credentials: true,
  })
);


app.use("/api",ChatRoutes);
app.use("/api",UserRoutes);



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

