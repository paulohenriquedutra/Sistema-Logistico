window.entregas = [
  { id: "001", responsavel: "João Silva", cliente: "Tech Solutions", nf: "987654321", status: "pendente" },
  { id: "002", responsavel: "Maria Souza", cliente: "E-Commerce LTDA", nf: "987654322", status: "em-rota" },
  { id: "003", responsavel: "Carlos Pereira", cliente: "Construtora Alpha", nf: "987654323", status: "entregue" },
  { id: "005", responsavel: "Pedro Santos", cliente: "Indústria Metal", nf: "987654325", status: "pendente" },
  { id: "006", responsavel: "Juliana Lima", cliente: "Escritório Contábil", nf: "987654326", status: "em-rota" },
  { id: "007", responsavel: "Ricardo Nunes", cliente: "Residência P.", nf: "987654327", status: "entregue" }
];

const lista = document.querySelector(".container-dados");
const botoesFiltro = document.querySelectorAll(".filtro");
const searchInput = document.querySelector('input[type="search"]');
const modal = document.getElementById("newDeliveryModal");
const form = document.getElementById("newDeliveryForm");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");

const STATUSES = ["pendente", "em-rota", "entregue"];

function renderizarEntregas(dados) {
  lista.innerHTML = dados.length
    ? dados.map((e, i) => `
      <li class="dados p-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer ${i % 2 ? 'bg-gray-50' : ''}">
        <div class="dado font-mono text-xs text-gray-500">${e.id}</div>
        <div class="dado font-medium">${e.responsavel}</div>
        <div class="dado font-medium">${e.cliente}</div>
        <div class="dado font-medium">${e.nf}</div>
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

function handleStatusChange(id) {
  const entrega = entregas.find(e => e.id === id);
  if (!entrega) return;
  entrega.status = STATUSES[(STATUSES.indexOf(entrega.status) + 1) % STATUSES.length];
  aplicarFiltros();
}

function getNextId() {
  return String(Math.max(...entregas.map(e => +e.id)) + 1).padStart(3, '0');
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

form.addEventListener('submit', e => {
  e.preventDefault();
  entregas.push({
    id: getNextId(),
    responsavel: responsavelInput.value,
    cliente: clienteInput.value,
    nf: nfInput.value,
    status: "pendente"
  });
  searchInput.value = '';
  botoesFiltro.forEach(b => b.classList.remove("ativo", "bg-[var(--tertiary)]", "text-white", "shadow-lg"));
  renderizarEntregas(entregas);
  closeModal();
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
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

document.addEventListener("DOMContentLoaded", () => renderizarEntregas(entregas));
