import { UserModel } from "../models/user.model.js"
import { getToken } from "../utils/token.js"


export const googleAuth=async (req, res)=>{
    try {
        const {userName, email}=req.body

        let user=await UserModel.findOne({email})

        if(!user){
            user=await UserModel.create({
                userName,
                email
            })
        }

        const token=getToken(user._id)

        return res.status(200).json({
            user,
            token: token
        })
    } catch (error) {
        console.log(`Error in google auth controller: ${error}`)
        return res.status(500).json({message: `googleSignUp error ${error}`})
    }
}