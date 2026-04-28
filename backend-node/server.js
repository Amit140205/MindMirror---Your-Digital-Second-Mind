import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./utils/connectDB.js"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"

dotenv.config()

const app=express()
const port=process.env.PORT || 8000

app.use(cors({
    origin: "*",  // for development
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
    connectDB()
})