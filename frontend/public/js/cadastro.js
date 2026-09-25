const formulario = document.querySelector("#formulario-cadastro");
const mensagem = document.querySelector("#mensagem-cadastro");
const botao = formulario.querySelector('button[type="submit"]');

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const dadosFormulario = new FormData(formulario);
  const nome = dadosFormulario.get("nome");
  const email = dadosFormulario.get("email");
  const senha = dadosFormulario.get("senha");

  botao.disabled = true;
  botao.textContent = "Criando conta...";
  mensagem.textContent = "";

  try {
    const resposta = await fetch("/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });
    const resultado = await resposta.json();

    mensagem.textContent = resultado.mensagem;
    mensagem.setAttribute("role", resposta.ok ? "status" : "alert");

    if (resposta.ok) {
      formulario.reset();
    }
  } catch (erro) {
    mensagem.textContent = "Não foi possível enviar o cadastro. Tente novamente.";
    mensagem.setAttribute("role", "alert");
  } finally {
    botao.disabled = false;
    botao.textContent = "Criar conta";
  }
});
