const formulario = document.querySelector("#formulario-login");
const mensagem = document.querySelector("#mensagem-login");
const botao = formulario.querySelector('button[type="submit"]');

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  if (botao.disabled) {
    return;
  }

  const dadosFormulario = new FormData(formulario);
  const email = dadosFormulario.get("email");
  const senha = dadosFormulario.get("senha");

  botao.disabled = true;
  botao.textContent = "Verificando...";
  mensagem.textContent = "";

  try {
    const resposta = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const resultado = await resposta.json();

    mensagem.setAttribute("role", resposta.ok ? "status" : "alert");
    mensagem.textContent = resultado.mensagem;

    if (resposta.ok) {
      formulario.reset();
    }
  } catch (erro) {
    mensagem.setAttribute("role", "alert");
    mensagem.textContent = "Não foi possível verificar as credenciais. Tente novamente.";
  } finally {
    botao.disabled = false;
    botao.textContent = "Entrar na conta →";
  }
});
