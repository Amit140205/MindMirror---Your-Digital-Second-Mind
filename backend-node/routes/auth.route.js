import express from "express"
import { googleAuth } from "../controllers/auth.controller.js"

const authRouter=express.Router()

authRouter.post("/google-auth", googleAuth)

export default authRouter