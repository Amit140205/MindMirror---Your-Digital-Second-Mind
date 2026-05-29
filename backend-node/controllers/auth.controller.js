import { UserModel } from "../models/user.model.js"
import { buildWelcomeEmail } from "../utils/buildWelcomeEmail.js"
import { getToken } from "../utils/token.js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const googleAuth = async (req, res) => {
    try {
        const { userName, email } = req.body
        
        let user = await UserModel.findOne({ email })
        const isNewUser = !user
        
        if (!user) {
            user = await UserModel.create({ userName, email })
        }
        
        const token = getToken(user._id)
        

        // Send welcome email only on first signup (not on every login)
        if (isNewUser) {
            try {
                await resend.emails.send({
                    from: "MindMirror <onboarding@resend.dev>",
                    to: email,
                    subject: "Welcome to MindMirror — Your privacy, explained",
                    html: buildWelcomeEmail(userName),
                })
                console.log(`MindMirror: welcome email sent to ${email}`)
            } catch (emailErr) {
                // Email failure must never block the auth response
                console.log(`MindMirror: welcome email failed for ${email}:`, emailErr.message)
            }
        }

        return res.status(200).json({
            user,
            token: token
        })
    } catch (error) {
        console.log(`Error in google auth controller: ${error}`)
        return res.status(500).json({ message: `googleSignUp error ${error}` })
    }
}