import express from "express";
import { rotasJogos } from "./rotas/jogos.rotas.js";
import { rotasUsuarios } from "./rotas/usuarios.rotas.js";
import { rotasLogin } from "./rotas/login.rotas.js";

const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static("frontend/public"));

app.get("/", (requisicao, resposta) => {
  resposta.json({ mensagem: "Steam Games API funcionando" });
});

app.use(rotasJogos);
app.use(rotasUsuarios);
app.use(rotasLogin);

app.listen(porta, () => {
  console.log(`Servidor executando em http://localhost:${porta}`);
});
