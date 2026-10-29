import { Router } from "express";
import { prisma } from "../prismaClient.js";
import { criarHashSenha } from "../senha.js";

export const rotasUsuarios = Router();

rotasUsuarios.post("/usuarios", async (requisicao, resposta) => {
  const { nome, email, senha } = requisicao.body ?? {};

  if (
    typeof nome !== "string" ||
    typeof email !== "string" ||
    typeof senha !== "string"
  ) {
    return resposta.status(400).json({
      mensagem: "Informe nome, e-mail e senha como texto.",
    });
  }

  const nomeTratado = nome.trim();
  const emailTratado = email.trim().toLowerCase();

  if (nomeTratado.length < 2 || nomeTratado.length > 100) {
    return resposta.status(400).json({
      mensagem: "O nome deve ter entre 2 e 100 caracteres.",
    });
  }

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
    const senhaHash = await criarHashSenha(senha);
    const usuario = await prisma.usuarios.create({
      data: { nome: nomeTratado, email: emailTratado, senhaHash },
      select: { id: true, nome: true, email: true, criadoEm: true },
    });

    return resposta.status(201).json({
      mensagem: "Cadastro realizado com sucesso.",
      usuario,
    });
  } catch (erro) {
    if (erro.code === "P2002") {
      return resposta.status(409).json({
        mensagem: "Este e-mail já está cadastrado.",
      });
    }

    return resposta.status(500).json({
      mensagem: "Não foi possível realizar o cadastro.",
    });
  }
});

rotasUsuarios.get("/infousuarios", async (requisicao, resposta) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      select: { id: true, nome: true, email: true, criadoEm: true },
      orderBy: { id: "asc" },
    });

    return resposta.json(usuarios);
  } catch (erro) {
    console.error("Não foi possível buscar os usuários:", erro.message);

    return resposta.status(500).json({
      mensagem: "Não foi possível buscar os usuários.",
    });
  }
});
