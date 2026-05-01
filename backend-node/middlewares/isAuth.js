import jwt from "jsonwebtoken"
import { UserModel } from "../models/user.model.js"

export const isAuth=async (req, res, next)=>{
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(" ")[1]

         if(!token){
            return res.status(401).json({message:"Token is not found"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await UserModel.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user = user
        next()
    } catch (error) {
        console.log(`Error in isAuth middleware: ${error}`)

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" })
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" })
        }

        return res.status(500).json({message:`isAuth error ${error}`})
    }
}