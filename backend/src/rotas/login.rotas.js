import { Router } from "express";
import { prisma } from "../prismaClient.js";
import { verificarSenha } from "../senha.js";

export const rotasLogin = Router();

rotasLogin.post("/login", async (requisicao, resposta) => {
  const { email, senha } = requisicao.body ?? {};

  if (typeof email !== "string" || typeof senha !== "string") {
    return resposta.status(400).json({
      mensagem: "Informe e-mail e senha como texto.",
    });
  }

  const emailTratado = email.trim().toLowerCase();

  if (
    emailTratado.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTratado)
  ) {
    return resposta.status(400).json({
      mensagem: "Informe um e-mail válido.",
    });
  }

  if (senha.length < 8 || senha.length > 100) {
    return resposta.status(400).json({
      mensagem: "A senha deve ter entre 8 e 100 caracteres.",
    });
  }

  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { email: emailTratado },
      select: { id: true, nome: true, email: true, senhaHash: true },
    });

    if (!usuario || !(await verificarSenha(senha, usuario.senhaHash))) {
      return resposta.status(401).json({
        mensagem: "E-mail ou senha incorretos.",
      });
    }

    return resposta.status(200).json({
      mensagem: "Credenciais verificadas com sucesso.",
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (erro) {
    return resposta.status(500).json({
      mensagem: "Não foi possível verificar as credenciais.",
    });
  }
});
