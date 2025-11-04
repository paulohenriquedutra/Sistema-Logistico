document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensagem = document.getElementById("mensagem");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login").value;
    const senha = document.getElementById("senha").value;

    mensagem.style.display = "block";
    mensagem.textContent = "Entrando...";
    mensagem.style.backgroundColor = "";
    mensagem.style.color = "";
    try {
      const response = await fetch("http://localhost:3000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        mensagem.textContent = "Login realizado!";
        localStorage.setItem("token", data.token);
        window.location.href = "../index/home.html";
      } else {
        mensagem.style.background = "#e93737ff"
        mensagem.style.color = "#800a0aff"
        mensagem.textContent = data.message || "Email ou senha inválidos!";
      }
    } catch (error) {
      mensagem.style.background = "#e93737ff"
      mensagem.style.color = "#800a0aff"
      mensagem.textContent = "Erro ao conectar ao servidor.";
      console.error(error);
    }
  });
});
