import { buscarJogos, buscarDetalhesJogo } from "../src/steamApi.js";
import { prisma } from "../src/prismaClient.js";

async function adicionarJogos() {
  try {
    const jogos = await buscarJogos(2);

    if (jogos.length === 0) {
      throw new Error("A Steam nao retornou nenhum jogo.");
    }

    for (const jogo of jogos) {
      try {
        const jogoComDetalhes = await buscarDetalhesJogo(jogo);

        if (jogoComDetalhes.detalhesDisponiveis === false) {
          console.error(
            `Os detalhes do jogo ${jogo.appid} nao estao disponiveis.`
          );
          continue;
        }

        const jogoSalvo = await prisma.jogos.create({
          data: jogoComDetalhes,
        });

        console.log("Jogo salvo com sucesso:");
        console.log(jogoSalvo);
      } catch (erro) {
        if (erro.code === "P2002") {
          console.error(`O jogo ${jogo.appid} ja existe no banco de dados.`);
        } else {
          throw erro;
        }
      }
    }
  } catch (erro) {
    console.error("Nao foi possivel salvar os jogos:", erro.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

adicionarJogos();
