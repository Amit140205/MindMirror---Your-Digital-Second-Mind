export const getCurrentUser=async (req, res)=>{
    try {
        const user=req.user
        return res.status(200).json({user})
    } catch (error) {
        console.log("error in get current user controller")
        return res.status(500).json({message: `get current user error ${error}`})
    }
}