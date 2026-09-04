import "dotenv/config";

const steamApiKey = process.env.STEAM_API_KEY;

function criarUrlImagem(appid) {
  return `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${appid}/header.jpg`;
}

function normalizarIdadeMinima(requiredAge) {
  const idadeMinima = Number.parseInt(requiredAge, 10);

  return Number.isNaN(idadeMinima) || idadeMinima < 0 ? 0 : idadeMinima;
}

function normalizarPreco(detalhes) {
  if (detalhes.is_free) {
    return 0;
  }

  const precoEmCentavos = detalhes.price_overview?.final;

  return Number.isFinite(precoEmCentavos) && precoEmCentavos >= 0
    ? precoEmCentavos / 100
    : null;
}

function normalizarDataLancamento(dataLancamento) {
  if (typeof dataLancamento !== "string" || !dataLancamento.trim()) {
    return null;
  }

  const meses = {
    jan: 0,
    fev: 1,
    mar: 2,
    abr: 3,
    mai: 4,
    jun: 5,
    jul: 6,
    ago: 7,
    set: 8,
    out: 9,
    nov: 10,
    dez: 11,
  };

  const dataNormalizada = dataLancamento
    .toLowerCase()
    .replaceAll(".", "")
    .trim();
  const partes = dataNormalizada.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);

  if (!partes) {
    return null;
  }

  const dia = Number(partes[1]);
  const mes = meses[partes[2]];
  const ano = Number(partes[3]);

  if (mes === undefined) {
    return null;
  }

  const data = new Date(Date.UTC(ano, mes, dia));
  const dataEhValida =
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes &&
    data.getUTCDate() === dia;

  return dataEhValida ? data : null;
}

async function buscarJogos(quantidade, lastAppId) {
  if (!steamApiKey) {
    throw new Error("Defina a variavel STEAM_API_KEY antes de executar o arquivo.");
  }

  const url = new URL(
    "https://api.steampowered.com/IStoreService/GetAppList/v1/"
  );

  url.searchParams.set("key", steamApiKey);
  url.searchParams.set("max_results", quantidade.toString());

  if (lastAppId !== undefined) {
    url.searchParams.set("last_appid", lastAppId.toString());
  }

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(`A Steam respondeu com o status ${resposta.status}`);
  }

  const dados = await resposta.json();
  return dados.response.apps;
}

async function buscarDetalhesJogo(jogo) {
  const url = new URL("https://store.steampowered.com/api/appdetails");

  url.searchParams.set("appids", jogo.appid.toString());
  url.searchParams.set("cc", "br");
  url.searchParams.set("l", "portuguese");

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(
      `Erro ao buscar detalhes do app ${jogo.appid}: ${resposta.status}`
    );
  }

  const resultado = await resposta.json();
  const itemEncontrado = resultado[jogo.appid];
  const imageUrl = criarUrlImagem(jogo.appid);

  if (!itemEncontrado?.success) {
    return {
      ...jogo,
      imageUrl,
      detalhesDisponiveis: false,
    };
  }

  const detalhes = itemEncontrado.data;

  return {
    appid: jogo.appid,
    nome: detalhes.name ?? jogo.name,
    imageUrl,
    sinopse: detalhes.short_description ?? null,
    idadeMinima: normalizarIdadeMinima(detalhes.required_age),
    desenvolvedoras: detalhes.developers ?? [],
    publicadoras: detalhes.publishers ?? [],
    generos: detalhes.genres?.map((genero) => genero.description) ?? [],
    dataLancamento: normalizarDataLancamento(detalhes.release_date?.date),
    preco: normalizarPreco(detalhes),
  };
}

export {
  buscarJogos,
  buscarDetalhesJogo,
  criarUrlImagem,
  normalizarIdadeMinima,
  normalizarPreco,
  normalizarDataLancamento,
};
