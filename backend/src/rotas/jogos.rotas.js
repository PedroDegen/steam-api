import { Router } from "express";
import { prisma } from "../prismaClient.js";

export const rotasJogos = Router();

rotasJogos.get("/games", async (requisicao, resposta) => {
  try {
    const jogos = await prisma.jogos.findMany({
      orderBy: { id: "asc" },
    });

    resposta.json(jogos);
  } catch (erro) {
    console.error("Não foi possível buscar os jogos:", erro.message);

    resposta.status(500).json({
      mensagem: "Não foi possível buscar os jogos.",
    });
  }
});

rotasJogos.get("/games/:id", async (requisicao, resposta) => {
  const id = Number(requisicao.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return resposta.status(400).json({
      mensagem: "O ID deve ser um número inteiro maior que zero.",
    });
  }

  try {
    const jogo = await prisma.jogos.findUnique({
      where: { id },
    });

    if (!jogo) {
      return resposta.status(404).json({
        mensagem: "Jogo não encontrado.",
      });
    }

    resposta.json(jogo);
  } catch (erro) {
    console.error("Não foi possível buscar o jogo:", erro.message);

    resposta.status(500).json({
      mensagem: "Não foi possível buscar o jogo.",
    });
  }
});
