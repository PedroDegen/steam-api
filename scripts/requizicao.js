import { buscarJogos, buscarDetalhesJogo } from "../src/steamApi.js";

async function executar() {
  try {
    const jogos = await buscarJogos(10);
    const jogosComDetalhes = [];

    for (const jogo of jogos) {
      const jogoComDetalhes = await buscarDetalhesJogo(jogo);
      jogosComDetalhes.push(jogoComDetalhes);
    }

    console.log(jogosComDetalhes);
  } catch (erro) {
    console.error("Nao foi possivel consultar a Steam:", erro.message);
  }
}

executar();
