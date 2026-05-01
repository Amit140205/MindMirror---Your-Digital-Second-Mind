import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { getCurrentUser } from "../controllers/user.controller.js"
import { saveSessions } from "../controllers/sessions.controller.js"

const userRouter=express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)

userRouter.post("/sessions", isAuth, saveSessions)

export default userRouter