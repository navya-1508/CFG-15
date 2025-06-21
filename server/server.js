import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/authRoutes.js"


dotenv.config()

const app = express()
const PORT = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI 

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err)
})

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use("/api/auth", authRoutes)


// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running...")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

