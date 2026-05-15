import os
import hmac
import hashlib
import base64

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

IV_LENGTH  = 12
TAG_LENGTH = 16 

# Key Derivation
# Must produce identical output to Node.js deriveKey()
# Node.js: crypto.createHmac("sha256", secret).update(userId).digest()
# Python:  hmac.new(secret, userId, sha256).digest()

def derive_key(user_id: str) -> bytes:
    secret = os.getenv("ENCRYPTION_SECRET")
    if not secret:
        raise ValueError("ENCRYPTION_SECRET not set in .env")

    return hmac.new(
        secret.encode("utf-8"),
        user_id.encode("utf-8"),
        hashlib.sha256
    ).digest()  # 32 bytes — matches AES-256 key size

# Decrypt
# Expects base64 string with layout: iv(12) + tag(16) + ciphertext
# This is the exact layout Node.js encrypt() produces
# Returns "" on empty input or decryption failure (so tool never crashes)

def decrypt(ciphertext: str, user_id: str) -> str:
    if not ciphertext or ciphertext == "":
        return ""

    try:
        key = derive_key(user_id)
        combined = base64.b64decode(ciphertext)

        # Extract components — same layout as Node.js
        iv = combined[:IV_LENGTH]
        tag = combined[IV_LENGTH : IV_LENGTH + TAG_LENGTH]
        encrypted = combined[IV_LENGTH + TAG_LENGTH :]

        aesgcm = AESGCM(key)

        # AESGCM.decrypt() expects ciphertext + tag concatenated as one arg
        decrypted = aesgcm.decrypt(iv, encrypted + tag, None)

        return decrypted.decode("utf-8")

    except Exception as e:
        print(f"Decryption error for user {user_id}: {e}")
        return ""  # return empty rather than crash the tool