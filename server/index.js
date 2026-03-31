import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CONNECT DATABASE
mongoose.connect("mongodb+srv://dhakshi081206_db_user:dhak123@ridelink.dtikqnl.mongodb.net/?appName=RideLink")
  .then(()=>console.log("Mongodb connected"))
  .catch((err) => console.log(err));

// test route
app.get("/", (req, res) => {
  res.send("API is working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});