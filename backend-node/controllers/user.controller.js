import { UserModel } from "../models/user.model.js"

export const getCurrentUser=async (req, res)=>{
    try {
        const user=req.user
        return res.status(200).json({user})
    } catch (error) {
        console.log("error in get current user controller")
        return res.status(500).json({message: `get current user error ${error}`})
    }
}

export const getIgnoredPatterns = async (req, res) => {
    try {
        const user = req.user
        return res.status(200).json({ ignoredPatterns: user.ignoredPatterns || [] })
    } catch (error) {
        console.log("error in getIgnoredPatterns controller")
        return res.status(500).json({ message: `getIgnoredPatterns error ${error}` })
    }
}

export const updateIgnoredPatterns = async (req, res) => {
    try {
        const userId = req.user._id
        const { patterns } = req.body
 
        if (!Array.isArray(patterns)) {
            return res.status(400).json({ message: "patterns must be an array" })
        }
 
        // deduplicate on backend — last write wins
        const unique = [...new Set(patterns.map(p => p.trim().toLowerCase()).filter(Boolean))]
 
        const updated = await UserModel.findByIdAndUpdate(
            userId,
            { ignoredPatterns: unique },
            { new: true }
        )
 
        return res.status(200).json({ ignoredPatterns: updated.ignoredPatterns })
    } catch (error) {
        console.log("error in updateIgnoredPatterns controller")
        return res.status(500).json({ message: `updateIgnoredPatterns error ${error}` })
    }
}