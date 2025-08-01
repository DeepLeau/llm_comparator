import crypto from "crypto"

// Set encryption key
if (!process.env.ENCRYPTION_KEY) {
  console.warn("⚠️ ENCRYPTION_KEY not set. Generating temporary key (data will be lost on restart).")
  process.env.ENCRYPTION_KEY = crypto.randomBytes(32).toString("hex")
}

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex")
const ALGORITHM = "aes-256-gcm"
const IV_LENGTH = 12 // Recommended length for GCM

export interface EncryptedData {
  encryptedData: string
  iv: string
  tag: string
  version: number
}

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encrypt(plaintext: string): EncryptedData {
  try {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv)

    const encrypted = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ])

    const tag = cipher.getAuthTag()

    return {
      encryptedData: encrypted.toString("hex"),
      iv: iv.toString("hex"),
      tag: tag.toString("hex"),
      version: 1,
    }
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

/**
 * Decrypt sensitive data - supports both object and individual parameters
 */
export function decrypt(
  encryptedDataOrObject: string | EncryptedData,
  iv?: string,
  tag?: string,
  version?: number
): string {
  try {
    let encrypted: string
    let decryptVersion: number
    let ivHex: string
    let tagHex: string

    if (typeof encryptedDataOrObject === "object") {
      encrypted = encryptedDataOrObject.encryptedData
      ivHex = encryptedDataOrObject.iv
      tagHex = encryptedDataOrObject.tag
      decryptVersion = encryptedDataOrObject.version
    } else {
      encrypted = encryptedDataOrObject
      ivHex = iv!
      tagHex = tag!
      decryptVersion = version || 1
    }

    if (!encrypted || !ivHex || !tagHex) {
      throw new Error("Missing encrypted data, IV, or tag")
    }

    if (decryptVersion !== 1) {
      throw new Error(`Unsupported encryption version: ${decryptVersion}`)
    }

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      ENCRYPTION_KEY,
      Buffer.from(ivHex, "hex")
    )
    decipher.setAuthTag(Buffer.from(tagHex, "hex"))

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "hex")),
      decipher.final(),
    ])

    return decrypted.toString("utf8")
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

/**
 * Securely compare two strings to prevent timing attacks
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}

/**
 * Generate a cryptographically secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}
