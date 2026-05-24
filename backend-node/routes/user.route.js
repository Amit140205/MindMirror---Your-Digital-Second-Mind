import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { getCurrentUser } from "../controllers/user.controller.js"
import { deleteAllSessions, saveSessions } from "../controllers/sessions.controller.js"
import { getAnalytics } from "../controllers/analytics.controller.js"

const userRouter=express.Router()

userRouter.get("/current-user", isAuth, getCurrentUser)

userRouter.post("/sessions", isAuth, saveSessions)

userRouter.delete("/sessions", isAuth, deleteAllSessions)

userRouter.get("/analytics", isAuth, getAnalytics)

export default userRouter