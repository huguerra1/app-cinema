import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

const keyLength = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(
  password: string,
  storedPassword: string,
): Promise<boolean> {
  if (!storedPassword.startsWith('scrypt$')) {
    // Compara senhas legadas com buffers de tamanho fixo, mesmo com Unicode.
    const digest = (value: string) =>
      createHash('sha256').update(value).digest();
    return timingSafeEqual(digest(password), digest(storedPassword));
  }

  // Um hash malformado nunca deve ser interpretado como senha legada.
  const parts = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(
    storedPassword,
  );
  if (!parts) return false;
  const key = await deriveKey(password, Buffer.from(parts[1], 'hex'));
  return timingSafeEqual(key, Buffer.from(parts[2], 'hex'));
}
