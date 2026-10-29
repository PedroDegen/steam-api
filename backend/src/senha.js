import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);

export async function criarHashSenha(senha) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(senha, salt, 64);

  return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verificarSenha(senha, senhaHash) {
  if (typeof senha !== "string" || typeof senhaHash !== "string") {
    return false;
  }

  const partes = senhaHash.split(":");
  const [algoritmo, salt, hashHex] = partes;

  if (
    partes.length !== 3 ||
    algoritmo !== "scrypt" ||
    salt.length !== 32 ||
    /[^a-f0-9]/i.test(salt) ||
    hashHex.length !== 128 ||
    /[^a-f0-9]/i.test(hashHex)
  ) {
    return false;
  }

  const hashSalvo = Buffer.from(hashHex, "hex");
  const hashInformado = await scrypt(senha, salt, 64);

  return timingSafeEqual(hashSalvo, hashInformado);
}
