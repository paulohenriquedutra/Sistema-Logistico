window.entregas = [];

const lista = document.querySelector(".container-dados");
const botoesFiltro = document.querySelectorAll(".filtro");
const searchInput = document.querySelector('input[type="search"]');
const modal = document.getElementById("newDeliveryModal");
const form = document.getElementById("newDeliveryForm");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const entregadorSelect = document.getElementById("entregadorSelect");

const STATUSES = ["pendente", "em-rota", "entregue"];

function renderizarEntregas(dados) {
  lista.innerHTML = dados.length
    ? dados.map((e, i) => `
      <li class="dados p-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${i % 2 ? 'bg-gray-50' : ''}">
        <div class="dado font-mono text-xs text-gray-500">${e.id}</div>
        <div class="dado font-medium">${e.responsavel}</div>
        <div class="dado font-medium">${e.cliente}</div>
        <div class="dado font-medium">${e.endereco}</div>
        <div class="dado font-medium">${e.notaFiscal}</div>
        <div class="dado status-container">
          <button data-id="${e.id}" class="change-status-btn status ${e.status} px-3 py-1 rounded-full font-bold text-center text-xs shadow-md w-full max-w-[180px] hover:shadow-lg transition-shadow">
            ${e.status.toUpperCase().replace('-', ' ')}
          </button>
        </div>
      </li>
    `).join('')
    : '<li class="p-4 text-center text-gray-500 italic">Nenhuma entrega encontrada.</li>';
}

function aplicarFiltros() {
  const termo = searchInput.value.toLowerCase();
  const ativo = document.querySelector(".filtro.ativo");
  let filtradas = window.entregas;

  if (ativo) filtradas = filtradas.filter(e => e.status === ativo.dataset.status);

  if (termo) {
    filtradas = filtradas.filter(e =>
      e.id.toLowerCase().includes(termo) ||
      e.responsavel.toLowerCase().includes(termo) ||
      e.cliente.toLowerCase().includes(termo) ||
      e.nf.includes(termo)
    );
  }

  renderizarEntregas(filtradas);
}

async function handleStatusChange(id) {
  const entrega = entregas.find(e => e.id === id);
  if (!entrega) return;

  const novoStatus = STATUSES[(STATUSES.indexOf(entrega.status) + 1) % STATUSES.length];
  entrega.status = novoStatus;

  await fetch(`http://localhost:3000/entregas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus })
  });

  aplicarFiltros();
}

function openModal() {
  modal.classList.remove("pointer-events-none", "opacity-0");
  modal.querySelector('div').classList.replace("scale-95", "scale-100");
}

function closeModal() {
  modal.querySelector('div').classList.replace("scale-100", "scale-95");
  setTimeout(() => {
    modal.classList.add("pointer-events-none", "opacity-0");
    form.reset();
  }, 300);
}

async function carregarEntregas() {
  const res = await fetch("http://localhost:3000/entregas");
  window.entregas = await res.json();
  renderizarEntregas(entregas);
}

async function carregarEntregadores() {
  const res = await fetch("http://localhost:3000/entregadores");
  const entregadores = await res.json();

  entregadorSelect.innerHTML = '<option value="">Selecione o entregador</option>';
  entregadores.forEach(ent => {
    const option = document.createElement("option");
    option.value = ent.nome;
    option.textContent = ent.nome;
    entregadorSelect.appendChild(option);
  });
}
async function carregarNFs() {
  const res = await fetch("http://localhost:3000/notas-fiscais");
  const nfs = await res.json();
  window.notasFiscais = nfs;

  const nfSelect = document.getElementById("nfSelect");
  nfSelect.innerHTML = '<option value="">Selecione a Nota Fiscal</option>';

  nfs.forEach(nf => {
    const option = document.createElement("option");
    option.value = nf.numero;
    option.textContent = nf.numero;
    nfSelect.appendChild(option);
  });

  nfSelect.addEventListener("change", () => {
    const nfSelecionada = window.notasFiscais.find(n => n.numero === nfSelect.value);
    const clienteInput = document.getElementById("clienteInput");

    if (nfSelecionada && nfSelecionada.cliente) {
      clienteInput.value = nfSelecionada.cliente;
    } else {
      clienteInput.value = ""; 
    }
  });
}

form.addEventListener('submit', async e => {
  const endereco = document.getElementById('enderecoInput').value
  e.preventDefault();

  const novaEntrega = {
    responsavel: entregadorSelect.value,
    cliente: clienteInput.value,
    endereco,
    notaFiscal: nfSelect.value,
    status: "pendente"
  };

  const res = await fetch("http://localhost:3000/entregas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaEntrega)
  });

  if (res.ok) {
    await carregarEntregas();
    closeModal();
  } else {
    alert("Erro ao cadastrar entrega!");
  }
});

botoesFiltro.forEach(b => b.addEventListener("click", () => {
  const ativo = b.classList.contains("ativo");
  botoesFiltro.forEach(btn => btn.classList.remove("ativo", "bg-[var(--tertiary)]", "text-white", "shadow-lg"));
  if (!ativo) b.classList.add("ativo", "bg-[var(--tertiary)]", "text-white", "shadow-lg");
  aplicarFiltros();
}));

lista.addEventListener("click", e => {
  const btn = e.target.closest(".change-status-btn");
  if (btn) handleStatusChange(btn.dataset.id);
});

searchInput.addEventListener("input", aplicarFiltros);
openModalBtn.addEventListener("click", () => {
  openModal();
  carregarEntregadores(); 
  carregarNFs();
});
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("DOMContentLoaded", carregarEntregas);
