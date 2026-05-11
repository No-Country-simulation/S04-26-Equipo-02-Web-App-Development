import { createCipheriv, createDecipheriv, scryptSync, randomBytes } from "crypto";

// Usamos el secret de Better Auth como base para nuestra llave de cifrado
// Si no existe, usamos un fallback (pero en producción siempre debe estar)
const ENCRYPTION_KEY_BASE = process.env.BETTER_AUTH_SECRET || "fallback-secret-key-12345678901234567890123456789012";
const ALGORITHM = "aes-256-cbc";

// Generamos una llave de 32 bytes a partir del secret
const key = scryptSync(ENCRYPTION_KEY_BASE, "salt", 32);

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  // Devolvemos el IV junto con el texto cifrado para poder desencriptar después
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(text: string): string {
  try {
    const [ivHex, encryptedText] = text.split(":");
    if (!ivHex || !encryptedText) return text; // Si no tiene el formato, asumimos que no está cifrado (legacy)

    const iv = Buffer.from(ivHex, "hex");
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    // Si falla el descifrado, devolvemos el texto original (por si no estaba cifrado)
    console.error("❌ Error decrypting:", error);
    return text;
  }
}
