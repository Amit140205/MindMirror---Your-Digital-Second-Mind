import { UserModel } from "../models/user.model.js"
import { buildWelcomeEmail } from "../utils/buildWelcomeEmail.js"
import { getToken } from "../utils/token.js"
import { transporter } from "../utils/mailer.js"

export const googleAuth = async (req, res) => {
    try {
        const { userName, email } = req.body
        
        let user = await UserModel.findOne({ email })
        const isNewUser = !user
        
        if (!user) {
            user = await UserModel.create({ userName, email })
        }
        
        const token = getToken(user._id)
        
        if (isNewUser) {
            try {
                await transporter.sendMail({
                    from: `"MindMirror" <${process.env.GMAIL_USER}>`,
                    to: email,
                    subject: "Welcome to MindMirror — Your privacy, explained",
                    html: buildWelcomeEmail(userName, process.env.GMAIL_USER),
                })
                // console.log(`MindMirror: welcome email sent to ${email}`)
            } catch (emailErr) {
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