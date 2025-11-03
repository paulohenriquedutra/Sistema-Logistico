const notas = [
    { numero: "1001", cliente: "Tech Solutions", data: "2025-11-01", valor: "1500.00" },
    { numero: "1002", cliente: "E-Commerce LTDA", data: "2025-11-01", valor: "2500.50" },
    { numero: "1003", cliente: "Construtora Alpha", data: "2025-11-01", valor: "1200.75" }
];

function RenderizarTabelaNF(dados){
    const tabela = document.getElementById("corpo-tabelaNF");
    tabela.innerHTML = "";
    dados.forEach(nf => {
        const tr = document.createElement("tr");
        tr.className = "odd:bg-white even:bg-gray-50 hover:bg-gray-100";
        tr.innerHTML = `
            <td class="px-4 py-2 text-center">${nf.numero}</td>
            <td class="px-4 py-2 text-center">${nf.cliente}</td>
            <td class="px-4 py-2 text-center">${nf.data}</td>
            <td class="px-4 py-2 text-center">${nf.valor}</td>
            <td class="px-4 py-2 text-center">
                <button onclick="abrirNF('${nf.numero}')" class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Abrir</button>
            </td>
        `;
        tabela.appendChild(tr);
    });
}

function PesquisarNF() {
    const filtro = document.getElementById("pesquisaNF").value.toLowerCase().trim();
    const linhas = document.querySelectorAll("#corpo-tabelaNF tr");
    linhas.forEach(linha => {
        const numero = linha.cells[0].textContent.toLowerCase();
        const cliente = linha.cells[1].textContent.toLowerCase();
        linha.style.display = (numero.includes(filtro) || cliente.includes(filtro)) ? "" : "none";
    });
}

function gerarNumeroNF() {
    if (notas.length === 0) return "1001";
    const ultimaNF = notas[notas.length - 1].numero;
    const num = parseInt(ultimaNF.replace(/\D/g,'')) + 1;
    return num;
}

function gerarDataHoje() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2,'0');
    const mes = String(hoje.getMonth()+1).padStart(2,'0');
    const ano = hoje.getFullYear();
    return `${ano}-${mes}-${dia}`;
}

function openModal() {
    const modal = document.getElementById("produtoModal");
    document.getElementById("numeroNF").value = gerarNumeroNF();
    document.getElementById("dataNF").value = gerarDataHoje();   
    document.getElementById("clienteNF").value = "";
    document.getElementById("valorNF").value = "";
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
    const numero = document.getElementById("numeroNF").value;
    const cliente = document.getElementById("clienteNF").value;
    const data = document.getElementById("dataNF").value;  // pegando a data automática
    const valor = parseFloat(document.getElementById("valorNF").value).toFixed(2);

    const nf = { numero, cliente, data, valor };
    notas.push(nf);

    const tabela = document.getElementById("corpo-tabelaNF");
    const tr = document.createElement("tr");
    tr.className = "odd:bg-white even:bg-gray-50 hover:bg-gray-100";
    tr.innerHTML = `
        <td class="px-4 py-2 text-center">${numero}</td>
        <td class="px-4 py-2 text-center">${cliente}</td>
        <td class="px-4 py-2 text-center">${data}</td>
        <td class="px-4 py-2 text-center">${valor}</td>
        <td class="px-4 py-2 text-center">
            <button onclick="abrirNF('${numero}')" class="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Abrir</button>
        </td>
    `;
    tabela.appendChild(tr);
    closeModal();
});

function abrirNF(numero) {
    const imagemExemplo = "../media/modelonf.webp";
    window.open(imagemExemplo, "_blank");
}

document.getElementById("botao-pesquisaNF").addEventListener("click", PesquisarNF);

RenderizarTabelaNF(notas);
