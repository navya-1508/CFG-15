import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

const app = express()
const PORT = process.env.PORT 
const MONGO_URI = process.env.MONGO_URI 

mongoose.connect(MONGO_URI).then(() => {
  console.log("Connected to MongoDB")
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err)
})

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

