import express from "express"

const extensionRouter = express.Router()

extensionRouter.get("/open-extension", (req, res) => {
    const extensionId = process.env.EXTENSION_ID

    if (!extensionId) {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head><title>MindMirror</title></head>
            <body style="background:#0A0A0F;color:#EEEEF5;font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
                <div style="text-align:center;">
                    <p style="font-size:22px;font-weight:700;margin-bottom:12px;">🪞 MindMirror</p>
                    <p style="color:#8888AA;">Open the MindMirror extension from your browser toolbar to get started.</p>
                </div>
            </body>
            </html>
        `)
    }

    const extensionUrl = `chrome-extension://${extensionId}/newtab.html`
    return res.redirect(302, extensionUrl)
})

export default extensionRouter