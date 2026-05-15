import crypto from "crypto"
 
const ALGORITHM  = "aes-256-gcm"
const KEY_LENGTH = 32 
const IV_LENGTH  = 12  
const TAG_LENGTH = 16 

// Key Derivation 
// Derives a unique 32-byte key per user using HMAC-SHA256
// Same derivation logic used in FastAPI encryption.py
 
function deriveKey(userId) {
    const secret = process.env.ENCRYPTION_SECRET
    if (!secret) throw new Error("ENCRYPTION_SECRET not set in .env")
 
    return crypto
        .createHmac("sha256", secret)
        .update(userId.toString())
        .digest()  
}
 
// Encrypt
// Returns base64 string: iv(12 bytes) + authTag(16 bytes) + ciphertext
// Returns "" for empty/null input — no point encrypting empty strings
 
export function encrypt(plaintext, userId) {
    if (!plaintext || plaintext === "") return ""
 
    try {
        const key = deriveKey(userId)
        const iv  = crypto.randomBytes(IV_LENGTH)
 
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
 
        const encrypted = Buffer.concat([
            cipher.update(plaintext, "utf8"),
            cipher.final()
        ])
 
        const authTag = cipher.getAuthTag()
 
        // Layout: iv(12) + tag(16) + ciphertext
        // FastAPI decrypt expects the same layout
        const combined = Buffer.concat([iv, authTag, encrypted])
        return combined.toString("base64")
 
    } catch (error) {
        console.log("Encryption error:", error)
        throw error
    }
}