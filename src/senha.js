import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function criarHashSenha(senha) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(senha, salt, 64);

  return `scrypt:${salt}:${hash.toString("hex")}`;
}
