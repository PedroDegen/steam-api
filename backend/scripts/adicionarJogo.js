import { buscarJogos, buscarDetalhesJogo } from "../src/steamApi.js";
import { prisma } from "../src/prismaClient.js";

async function adicionarPrimeiroJogo() {
  try {
    const jogos = await buscarJogos(1,10);
    const primeiroJogo = jogos[0];

    if (!primeiroJogo) {
      throw new Error("A Steam nao retornou nenhum jogo.");
    }

    const jogoComDetalhes = await buscarDetalhesJogo(primeiroJogo);

    if (jogoComDetalhes.detalhesDisponiveis === false) {
      throw new Error(
        `Os detalhes do jogo ${primeiroJogo.appid} nao estao disponiveis.`
      );
    }

    const jogoSalvo = await prisma.jogos.create({
      data: jogoComDetalhes,
    });

    console.log("Jogo salvo com sucesso:");
    console.log(jogoSalvo);
  } catch (erro) {
    if (erro.code === "P2002") {
      console.error("Esse jogo ja existe no banco de dados.");
    } else {
      console.error("Nao foi possivel salvar o jogo:", erro.message);
    }

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

adicionarPrimeiroJogo();
