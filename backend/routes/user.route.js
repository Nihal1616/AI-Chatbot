import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup",async(req,res)=>{
    try{
        const {username,email,password}=req.body;

        if(!username || !email || !password)
            return res.status(400).json({message:"All fields are required"});

        const user=await User.findOne({
            email,
        });
        if(user) return res.status(400).json({message:"User already exist"});

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            username,
            email,
            password:hashedPassword,

        });
        await newUser.save();

        return res.json({message:"User Created"});


    }catch(err){
        return res.status(500).json({message:err.message});
    }
});

router.post("/login",async(req,res)=>{
    try{
      const { username, password } = req.body;

      if (!username || !password)
        return res.status(400).json({ messsage: "All fields required" });

      const user = await User.findOne({
        username,
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid Credentials" });

      //generating the token
      const token = crypto.randomBytes(32).toString("hex");

      // Store token in user document
      await User.findByIdAndUpdate(user._id, { token });

      return res.json({ token, username: user.username });
    }catch(err){
        return res.status(500).json({message:err.message});
    }
});


router.post("/verifyToken", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ valid: false, message: "Token required" });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res
        .status(401)
        .json({ valid: false, message: "Invalid or expired token" });
    }

    return res.json({ valid: true, username: user.username });
  } catch (err) {
    return res.status(500).json({ valid: false, message: err.message });
  }
});


router.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    await User.findOneAndUpdate({ token }, { token: null });
    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


export default router;