const dados = [
    { "id": "0001", "Produto": "Parafuso M6x20", "Quantidade": "500", "Localização": "P1-A01", "Fornecedor": "FixIt Supplies" },
    { "id": "0002", "Produto": "Cabo HDMI 2m", "Quantidade": "200", "Localização": "P1-A02", "Fornecedor": "TechLine" },
    { "id": "0003", "Produto": "Placa de Rede 1G", "Quantidade": "75", "Localização": "P1-A03", "Fornecedor": "NetWorks Ltd" },
    { "id": "0004", "Produto": "Monitor 24\"", "Quantidade": "50", "Localização": "P1-B01", "Fornecedor": "DisplayCorp" },
    { "id": "0005", "Produto": "Teclado Mecânico", "Quantidade": "120", "Localização": "P1-B02", "Fornecedor": "KeyMasters" },
    { "id": "0006", "Produto": "Roteador Wi-Fi AC", "Quantidade": "80", "Localização": "P1-B03", "Fornecedor": "NetWorks Ltd" },
    { "id": "0007", "Produto": "HD 1TB SATA", "Quantidade": "65", "Localização": "P1-C01", "Fornecedor": "StoragePlus" },
    { "id": "0008", "Produto": "Mouse Óptico USB", "Quantidade": "300", "Localização": "P1-C02", "Fornecedor": "KeyMasters" },
]
function RenderizarTabela(dados){
    let tabela = document.getElementById("corpo-tabela");
    tabela.innerHTML = "";
    dados.forEach(id => {
        const tr = document.createElement("tr");
        tr.className = "odd:bg-white even:bg-gray-50 hover:bg-gray-100";
        tr.innerHTML = `
            <td class="px-4 py-2 font-medium text-center">${id.id}</td>
            <td class="px-4 py-2 font-medium text-center">${id.Produto}</td>
            <td class="px-4 py-2 font-medium text-center">${id.Quantidade}</td>
            <td class="px-4 py-2 font-medium text-center">${id.Localização}</td>
            <td class="px-4 py-2 font-medium text-center">${id.Fornecedor}</td>
        `;
        tabela.appendChild(tr);
    });
}

function PesquisarProdutos() {
    const input = document.getElementById("pesquisa");
    const filtro = input.value.toLowerCase().trim();
    const tabela = document.getElementById("corpo-tabela");
    const linhas = tabela.getElementsByTagName("tr");

    if (filtro === "") {
        for (let i = 0; i < linhas.length; i++) linhas[i].style.display = "";
        return;
    }

    for (let i = 0; i < linhas.length; i++) {
        const celulaID = linhas[i].getElementsByTagName("td")[0];
        const celulaNome = linhas[i].getElementsByTagName("td")[1];

        if (celulaID && celulaNome) {
        const textoID = celulaID.textContent.toLowerCase();
        const textoNome = celulaNome.textContent.toLowerCase();

        if (textoID.includes(filtro) || textoNome.includes(filtro)) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
        }
    }
}
function openModal() {
  const modal = document.getElementById("produtoModal");
  const linhas = document.querySelectorAll("#corpo-tabela tr");
  
  let ultimoID = 0;
  if (linhas.length) {
    const matches = linhas[linhas.length - 1].querySelector("td:first-child").textContent.match(/\d+/g);
    ultimoID = matches ? parseInt(matches[matches.length - 1], 10) : 0;
  }

  document.getElementById("IdProduto").value = `${(ultimoID + 1).toString().padStart(4,'0')}`;
  document.getElementById("IdProduto").readOnly = true;

  modal.classList.remove("pointer-events-none","opacity-0");
  modal.classList.add("opacity-100");
  modal.querySelector("div").classList.replace("scale-95","scale-100");
}

function closeModal() {
  const modal = document.getElementById("produtoModal");
  modal.classList.add("pointer-events-none","opacity-0");
  modal.classList.remove("opacity-100");
  modal.querySelector("div").classList.replace("scale-100","scale-95");
  document.getElementById("produtoForm").reset();
}

document.getElementById("produtoForm").addEventListener("submit", e => {
  e.preventDefault();
  const tabela = document.getElementById("corpo-tabela");
  const form = e.target;

  const valores = ["IdProduto","nomeProduto","quantidadeProduto","localizacaoProduto","fornecedorProduto"]
                  .map(id => document.getElementById(id).value);

  const tr = document.createElement("tr");
  tr.className = "odd:bg-white even:bg-gray-50 hover:bg-gray-100";
  tr.innerHTML = valores.map(v => `<td class="px-4 py-2 text-center">${v}</td>`).join("");
  
  tabela.appendChild(tr);
  closeModal();
});

document.getElementById("botao-pesquisa").addEventListener("click", PesquisarProdutos);
RenderizarTabela(dados);