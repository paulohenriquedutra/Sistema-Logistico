const corpoTabela = document.getElementById("corpo-tabelaNF");
const modal = document.getElementById("produtoModal");
const formNF = document.getElementById("produtoForm");
const inputPesquisa = document.getElementById("pesquisaNF");
const botaoPesquisa = document.getElementById("botao-pesquisaNF");
const inputNumeroNF = document.getElementById("numeroNF");

let listaNotas = [];

async function carregarNotas() {
  try {
    const resposta = await fetch("http://localhost:3000/notas-fiscais");
    if (!resposta.ok) throw new Error("Erro ao buscar notas fiscais");
    listaNotas = await resposta.json();
    renderizarTabelaNF(listaNotas);
  } catch (erro) {
    console.error(erro);
    corpoTabela.innerHTML =
      `<tr><td colspan="5" class="text-center py-2 text-red-600">Erro ao carregar notas fiscais.</td></tr>`;
  }
}

function renderizarTabelaNF(dados) {
  corpoTabela.innerHTML = "";

  if (dados.length === 0) {
    corpoTabela.innerHTML =
      `<tr><td colspan="5" class="text-center py-2">Nenhuma nota encontrada.</td></tr>`;
    return;
  }

  dados.forEach((nf) => {
    const tr = document.createElement("tr");
    tr.className = "odd:bg-white even:bg-gray-50 hover:bg-gray-100";
    tr.innerHTML = `
      <td class="px-4 py-2 text-center">${nf.numero || nf.id}</td>
      <td class="px-4 py-2 text-center">${nf.cliente || nf.descricao || "—"}</td>
      <td class="px-4 py-2 text-center">${nf.dataEmissao || nf.data}</td>
      <td class="px-4 py-2 text-center">${nf.preco || nf.valor || 0}</td>
      <td class="px-4 py-2 text-center">
        <button onclick="abrirNF('${nf.numero || nf.id}')" class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Abrir</button>
      </td>
    `;
    corpoTabela.appendChild(tr);
  });
}

function pesquisarNF() {
  const termo = inputPesquisa.value.toLowerCase().trim();
  const filtradas = listaNotas.filter(
    (nf) =>
      (nf.numero && nf.numero.toLowerCase().includes(termo)) ||
      (nf.cliente && nf.cliente.toLowerCase().includes(termo)) ||
      (nf.descricao && nf.descricao.toLowerCase().includes(termo))
  );
  renderizarTabelaNF(filtradas);
}

botaoPesquisa.addEventListener("click", pesquisarNF);
inputPesquisa.addEventListener("keyup", pesquisarNF);

function gerarNumeroNF() {
  if (listaNotas.length === 0) return "1001";
  const ultima = listaNotas[listaNotas.length - 1].numero || "1000";
  const num = parseInt(ultima.replace(/\D/g, "")) + 1;
  return num;
}

function gerarDataHoje() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const ano = hoje.getFullYear();
  return `${ano}-${mes}-${dia}`;
}

function openModal() {
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.classList.add("opacity-100");
  modal.querySelector("div").classList.replace("scale-95", "scale-100");

  inputNumeroNF.value = gerarNumeroNF();
  document.getElementById("dataNF").value = gerarDataHoje();
  document.getElementById("clienteNF").value = "";
  document.getElementById("valorNF").value = "";
}

function closeModal() {
  modal.classList.add("pointer-events-none", "opacity-0");
  modal.classList.remove("opacity-100");
  modal.querySelector("div").classList.replace("scale-100", "scale-95");
  formNF.reset();
}

formNF.addEventListener("submit", async (e) => {
  e.preventDefault();

  const numero = document.getElementById("numeroNF").value;
  const cliente = document.getElementById("clienteNF").value.trim();
  const data = document.getElementById("dataNF").value;
  const valor = parseFloat(document.getElementById("valorNF").value).toFixed(2);

  if (!cliente || !valor) {
    alert("Preencha todos os campos obrigatórios!");
    return;
  }

  const novaNF = {
    numero,
    cliente,
    dataEmissao: data,
    preco: valor,
  };

  try {
    const resposta = await fetch("http://localhost:3000/notas-fiscais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaNF),
    });
    console.log("passsooooooou")

    const text = await resposta.text();
    let dataResp;
    try {
      dataResp = JSON.parse(text);
    } catch {
      console.error("Resposta não JSON:", text);
      throw new Error(text);
    }

    if (resposta.ok) {
      closeModal();
      carregarNotas();
    } else {
      alert(dataResp.mensagem || text || "Erro ao adicionar nota fiscal");
    }
  } catch (erro) {
    console.error("Erro ao salvar nota:", erro);
    alert("Não foi possível salvar a nota fiscal. Verifique o servidor.");
  }
});

function abrirNF(numero) {
  const imagemExemplo = "../media/modelonf.webp";
  window.open(imagemExemplo, "_blank");
}

carregarNotas();
