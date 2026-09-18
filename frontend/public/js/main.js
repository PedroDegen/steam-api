const listaJogos = document.querySelector("#lista-jogos");
const contadorJogos = document.querySelector("#contador-jogos");

function criarElemento(tag, classe, texto) {
  const elemento = document.createElement(tag);

  if (classe) {
    elemento.className = classe;
  }

  if (texto) {
    elemento.textContent = texto;
  }

  return elemento;
}

function criarCartaoJogo(jogo) {
  const cartao = criarElemento("article", "cartao-jogo");
  const tituloId = `titulo-jogo-${jogo.id}`;
  cartao.setAttribute("aria-labelledby", tituloId);

  const capa = criarElemento("div", "capa-jogo");

  if (jogo.imageUrl) {
    const imagem = document.createElement("img");
    imagem.src = jogo.imageUrl;
    imagem.alt = `Capa de ${jogo.nome}`;
    imagem.width = 460;
    imagem.height = 215;
    capa.append(imagem);
  } else {
    capa.append(criarElemento("span", "capa-indisponivel", "Imagem indisponível"));
  }

  const informacoes = criarElemento("div", "informacoes-jogo");
  const generos = jogo.generos?.length
    ? jogo.generos.join(" / ")
    : "Gênero não informado";
  const categoria = criarElemento("p", "categoria", generos);
  const titulo = criarElemento("h3", "", jogo.nome);
  titulo.id = tituloId;
  const descricao = criarElemento(
    "p",
    "descricao-jogo",
    jogo.sinopse || "Sinopse não disponível.",
  );

  const rodape = criarElemento("div", "rodape-cartao");
  rodape.append(
    criarElemento("span", "origem", "Steam"),
    criarElemento("span", "status-avaliacao", "Ainda sem avaliações"),
  );

  informacoes.append(categoria, titulo, descricao, rodape);
  cartao.append(capa, informacoes);

  return cartao;
}

function mostrarMensagem(texto, erro = false) {
  const mensagem = criarElemento("p", "mensagem-catalogo", texto);
  mensagem.setAttribute("role", erro ? "alert" : "status");

  if (erro) {
    mensagem.classList.add("erro");
  }

  listaJogos.replaceChildren(mensagem);
}

async function carregarJogos() {
  try {
    const resposta = await fetch("/games");

    if (!resposta.ok) {
      throw new Error(`A API respondeu com o status ${resposta.status}.`);
    }

    const jogos = await resposta.json();
    const quantidade = jogos.length;
    contadorJogos.textContent = `${quantidade} ${quantidade === 1 ? "jogo" : "jogos"}`;

    if (quantidade === 0) {
      mostrarMensagem("Nenhum jogo foi encontrado no catálogo.");
      return;
    }

    listaJogos.replaceChildren(...jogos.map(criarCartaoJogo));
  } catch (erro) {
    console.error("Não foi possível carregar o catálogo:", erro);
    contadorJogos.textContent = "Indisponível";
    mostrarMensagem("Não foi possível carregar os jogos. Tente novamente mais tarde.", true);
  }
}

carregarJogos();
