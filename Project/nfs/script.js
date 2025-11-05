const modal = document.getElementById("produtoModal");
const form = document.getElementById("produtoForm");
const produtoInput = document.getElementById("produtoNF");
const listaProdutos = document.getElementById("listaProdutos");
const quantidadeInput = document.getElementById("quantidadeNF");
const valorInput = document.getElementById("valorNF");
const tabelaProdutosNF = document.getElementById("tabelaProdutosNF");
let produtosAdicionados = [];


let produtos = [];
let produtoSelecionado = null;

async function carregarProdutos() {
  try {
    const res = await fetch("http://localhost:3000/produtos");
    produtos = await res.json();
    console.log("Produtos carregados:", produtos);
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

carregarProdutos();

// MODAL
async function openModal() {
  modal.classList.remove("opacity-0", "pointer-events-none");
  modal.classList.add("opacity-100", "pointer-events-auto");
  form.reset();
  produtoSelecionado = null;
  produtosAdicionados = [];
  atualizarTabelaProdutos();
  listaProdutos.classList.add("hidden");
  document.getElementById("dataNF").value = new Date().toISOString().split("T")[0];

  const novoNumero = await gerarNumeroSequencial();
  document.getElementById("numeroNF").value = novoNumero;
}


function closeModal() {
  modal.classList.add("opacity-0", "pointer-events-none");
  modal.classList.remove("opacity-100", "pointer-events-auto");
}
async function gerarNumeroSequencial() {
  try {
    const res = await fetch("http://localhost:3000/notas-fiscais");
    if (!res.ok) throw new Error("Erro ao buscar notas fiscais");

    const notas = await res.json();
    if (notas.length === 0) return 1001;

    const ultimasOrdenadas = notas
      .map(nf => parseInt(nf.numero))
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    const ultimoNumero = ultimasOrdenadas[ultimasOrdenadas.length - 1];
    return ultimoNumero + 1;
  } catch (err) {
    console.error("Erro ao gerar número sequencial:", err);
    return 1001; 
  }
}

produtoInput.addEventListener("input", () => {
  const termo = produtoInput.value.trim().toLowerCase();
  listaProdutos.innerHTML = "";

  if (termo.length === 0) {
    listaProdutos.classList.add("hidden");
    return;
  }

  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  console.log("Filtrados:", filtrados);

  if (filtrados.length === 0) {
    listaProdutos.classList.add("hidden");
    return;
  }

  filtrados.forEach(prod => {
    const li = document.createElement("li");
    li.textContent = `${prod.nome} - R$${prod.precoUnitario ?? 0}`;
    li.classList.add(
      "px-3", "py-2", "cursor-pointer", "hover:bg-gray-100",
      "border-b", "border-gray-200", "text-sm"
    );
    li.addEventListener("click", () => {
      produtoSelecionado = prod;
      produtoInput.value = prod.nome;
      listaProdutos.classList.add("hidden");
      calcularValorTotal();
    });
    listaProdutos.appendChild(li);
  });

  listaProdutos.classList.remove("hidden");
});

// CALCULO DO VALOR DE NF
function calcularValorTotal() {
  const precoUnitario = produtoSelecionado?.precoUnitario ?? 0;
  const quantidade = parseInt(quantidadeInput.value) || 1;
  const valorProdutoAtual = precoUnitario * quantidade;

  const totalExistente = produtosAdicionados.reduce((soma, p) => soma + (p.valorTotal || 0), 0);
  const valorTotal = totalExistente + valorProdutoAtual;

  valorInput.value = valorTotal.toFixed(2);
}

quantidadeInput.addEventListener("input", calcularValorTotal);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (produtosAdicionados.length === 0) {
    alert("Adicione ao menos um produto antes de salvar a nota fiscal.");
    return;
  }

  const nf = {
    numero: document.getElementById("numeroNF").value,
    cnpj: document.getElementById("cnpjNF").value,
    cliente: document.getElementById("clienteNF").value,
    endereco: document.getElementById("adressNF").value,
    dataEmissao: document.getElementById("dataNF").value,
    produtos: produtosAdicionados,
    valorTotal: parseFloat(valorInput.value)
  };


  try {
    const res = await fetch("http://localhost:3000/notas-fiscais", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nf)
    });

    if (res.ok) {
      alert("Nota Fiscal salva com sucesso!");
      closeModal();
    } else {
      alert("Erro ao salvar NF");
    }
  } catch (err) {
    console.error("Erro ao salvar NF:", err);
  }
});

// RENDERIZAR TABELA
async function carregarNotas() {
  try {
    const res = await fetch("http://localhost:3000/notas-fiscais");
    const notas = await res.json();
    const corpoTabela = document.getElementById("corpo-tabelaNF");
    corpoTabela.innerHTML = "";

    notas.forEach(nf => {
      const tr = document.createElement("tr");
      tr.classList.add("odd:bg-white", "even:bg-gray-50", "hover:bg-gray-100", "transition");

      tr.innerHTML = `
        <td class="px-4 py-2 text-center border-b">${nf.numero}</td>
        <td class="px-4 py-2 text-center border-b">${nf.cliente}</td>
        <td class="px-4 py-2 text-center border-b">${nf.dataEmissao}</td>
        <td class="px-4 py-2 text-center border-b">R$ ${nf.valorTotal?.toFixed(2) ?? "0.00"}</td>
        <td class="px-4 py-2 text-center border-b">
          <button onclick="verDetalhesNF(${nf.id})" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"">Ver</button>
          <button onclick="excluirNF(${nf.id})" class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all">Excluir</button>
        </td>
      `;

      corpoTabela.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao carregar notas fiscais:", err);
  }
}

carregarNotas();

// FUNÇÃO DE BUSCA
document.getElementById("botao-pesquisaNF").addEventListener("click", async () => {
  const termo = document.getElementById("pesquisaNF").value.trim().toLowerCase();
  try {
    const res = await fetch("http://localhost:3000/notas-fiscais");
    const notas = await res.json();
    const filtradas = notas.filter(
      nf =>
        nf.numero.toString().includes(termo) ||
        nf.cliente.toLowerCase().includes(termo)
    );

    const corpoTabela = document.getElementById("corpo-tabelaNF");
    corpoTabela.innerHTML = "";

    filtradas.forEach(nf => {
      const tr = document.createElement("tr");
      tr.classList.add("odd:bg-white", "even:bg-gray-50", "hover:bg-gray-100");

      tr.innerHTML = `
        <td class="px-4 py-2 text-center border-b">${nf.numero}</td>
        <td class="px-4 py-2 text-center border-b">${nf.cliente}</td>
        <td class="px-4 py-2 text-center border-b">${nf.dataEmissao}</td>
        <td class="px-4 py-2 text-center border-b">R$ ${nf.valorTotal?.toFixed(2) ?? "0.00"}</td>
        <td class="px-4 py-2 text-center border-b">
          <button onclick="verDetalhesNF(${nf.id})" class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">Ver</button>
          <button onclick="excluirNF(${nf.id})" class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all">Excluir</button>
        </td>
      `;
      corpoTabela.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro ao filtrar NF:", err);
  }
});

document.getElementById("pesquisaNF").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("botao-pesquisaNF").click();
  }
});

// DELETE
async function excluirNF(id) {
  if (!confirm("Deseja realmente excluir esta nota fiscal?")) return;

  try {
    const res = await fetch(`http://localhost:3000/notas-fiscais/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Nota Fiscal excluída com sucesso!");
      carregarNotas();
    } else {
      alert("Erro ao excluir NF.");
    }
  } catch (err) {
    console.error("Erro ao excluir NF:", err);
  }
}

// ABRIR NF
function verDetalhesNF(id) {
  fetch(`http://localhost:3000/notas-fiscais/${id}`)
    .then(res => res.json())
    .then(nf => {
      const produtosDetalhes = nf.produtos
        ?.map(
          (p, i) =>
            `${i + 1}. ${p.nome} — ${p.quantidade}un R$${p.precoUnitario.toFixed(2)} = R$${p.valorTotal.toFixed(2)}`
        )
        .join("\n") || "Nenhum produto";

      alert(
        `NF: ${nf.numero}\n` +
        `Cliente: ${nf.cliente}\n` +
        `CNPJ: ${nf.cnpj}\n` +
        `Endereço: ${nf.endereco}\n` +
        `Data: ${nf.dataEmissao}\n\n` +
        `Produtos:\n${produtosDetalhes}\n\n` +
        `Valor Total: R$ ${nf.valorTotal?.toFixed(2) ?? "0.00"}`
      );
    })
    .catch(err => console.error("Erro ao ver detalhes:", err));
}

// ADICIONAR PRODUTO
document.getElementById("adicionarProdutoNF").addEventListener("click", () => {
  
  if (!produtoSelecionado) {
    alert("Selecione um produto válido antes de adicionar.");
    return;
  }

  const quantidade = parseInt(quantidadeInput.value);
  if (!quantidade || quantidade <= 0) {
    alert("Informe uma quantidade válida.");
    return;
  }

  const precoUnitario = produtoSelecionado.precoUnitario ?? 0;
  const valorTotal = precoUnitario * quantidade;

  const existente = produtosAdicionados.find(p => p.nome === produtoSelecionado.nome);
  if (existente) {
    existente.quantidade += quantidade;
    existente.valorTotal += valorTotal;
  } else {
    produtosAdicionados.push({
      nome: produtoSelecionado.nome,
      quantidade,
      precoUnitario,
      valorTotal
    });
  }

  atualizarTabelaProdutos();
  produtoSelecionado = null;
  produtoInput.value = "";
  quantidadeInput.value = "";
  listaProdutos.classList.add("hidden");
});



//ATUALIZAR TABELA
function atualizarTabelaProdutos() {
  tabelaProdutosNF.innerHTML = "";
  let totalNF = 0;

  produtosAdicionados.forEach((p, i) => {
    totalNF += p.valorTotal;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-1 text-center border-b">${p.nome}</td>
      <td class="px-3 py-1 text-center border-b">${p.quantidade}</td>
      <td class="px-3 py-1 text-center border-b">R$ ${p.precoUnitario.toFixed(2)}</td>
      <td class="px-3 py-1 text-center border-b">R$ ${p.valorTotal.toFixed(2)}</td>
      <td class="px-3 py-1 text-center border-b">
        <button class="text-red-500 hover:text-red-700" onclick="removerProduto(${i})">✕</button>
      </td>
    `;
    tabelaProdutosNF.appendChild(tr);
  });

  valorInput.value = totalNF.toFixed(2);
}

function removerProduto(index) {
  produtosAdicionados.splice(index, 1);
  atualizarTabelaProdutos();
}
