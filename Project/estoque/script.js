const corpoTabela = document.getElementById('corpo-tabela');
const produtoForm = document.getElementById('produtoForm');
const modal = document.getElementById('produtoModal');
const inputPesquisa = document.getElementById('pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');

const inputs = {
  id: document.getElementById('IdProduto'),
  nome: document.getElementById('nomeProduto'),
  quantidade: document.getElementById('quantidadeProduto'),
  preco: document.getElementById('precoProduto'),
  localizacao: document.getElementById('localizacaoProduto'),
  fornecedor: document.getElementById('fornecedorProduto')
};

let listaProdutos = [];

// xxxxxxxxxxxxxxxxxxxx MODAL xxxxxxxxxxxxxxxxxxxx
function openModal(produto = null) {
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');

  if (produto) {
    inputs.id.value = produto.id;
    inputs.nome.value = produto.nome;
    inputs.quantidade.value = produto.quantidade;
    inputs.preco.value = produto.precoUnitario;
    inputs.localizacao.value = produto.localizacao || '';
    inputs.fornecedor.value = produto.fornecedor;
    produtoForm.querySelector('button[type="submit"]').textContent = 'Atualizar Produto';
  } else {
    produtoForm.reset(); 
    const novoId = listaProdutos.length
      ? Math.max(...listaProdutos.map(p => p.id)) + 1
      : 1;
    inputs.id.value = novoId;

    produtoForm.querySelector('button[type="submit"]').textContent = 'Salvar Produto';
  }
}

function closeModal() {
  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.classList.remove('opacity-100');
  produtoForm.reset();
}

function formatarPreco(valor) {
  return valor != null && valor !== ''
    ? 'R$ ' + parseFloat(valor).toFixed(2).replace('.', ',')
    : '-';
}

async function fetchProdutos(url, method = 'GET', body = null) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
  return res.json();
}

// xxxxxxxxxxxxxxxxxxxx TABELA xxxxxxxxxxxxxxxxxxxxx
function exibirProdutos(produtos) {
  corpoTabela.innerHTML = '';

  if (!produtos.length) {
    corpoTabela.innerHTML = '<tr><td colspan="7" class="text-center py-2">Nenhum produto encontrado.</td></tr>';
    return;
  }

  produtos.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'odd:bg-white even:bg-gray-50 hover:bg-gray-100';

    tr.innerHTML = `
      <td class="text-center px-4 py-2">${p.id ?? '-'}</td>
      <td class="text-center px-4 py-2">${p.nome ?? '-'}</td>
      <td class="text-center px-4 py-2">${p.quantidade ?? '-'}</td>
      <td class="text-center px-4 py-2">${formatarPreco(p.precoUnitario)}</td>
      <td class="text-center px-4 py-2">${p.localizacao || '-'}</td>
      <td class="text-center px-4 py-2">${p.fornecedor || '-'}</td>
      <td class="text-center px-4 py-2">
        <button class="btn-editar px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">Editar</button>
        <button onclick="excluirProduto(${p.id})" class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all">Excluir</button>
      </td>
    `;

    tr.querySelector('.btn-editar').addEventListener('click', () => openModal(p));

    corpoTabela.appendChild(tr);
  });
}

// xxxxxxxxxxxxxxxxxxxx CARREGAR xxxxxxxxxxxxxxxxxxxx
async function carregarProdutos() {
  try {
    listaProdutos = await fetchProdutos('http://localhost:3000/produtos');
    exibirProdutos(listaProdutos);
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    corpoTabela.innerHTML = '<tr><td colspan="7" class="text-center py-2">Não foi possível carregar os produtos.</td></tr>';
  }
}

// xxxxxxxxxxxxxxxxxxxx SALVAR/ATUALIZAR xxxxxxxxxxxxxxxxxxxx
produtoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = parseInt(inputs.id.value);
  const produtoExistente = listaProdutos.find(p => p.id === id);

  const dadosProduto = {
    nome: inputs.nome.value.trim(),
    quantidade: parseInt(inputs.quantidade.value.trim()),
    precoUnitario: parseFloat(inputs.preco.value.trim().replace(',', '.')),
    localizacao: inputs.localizacao.value.trim() || null,
    fornecedor: inputs.fornecedor.value.trim()
  };

  if (!dadosProduto.nome || isNaN(dadosProduto.quantidade) || isNaN(dadosProduto.precoUnitario) || !dadosProduto.fornecedor) {
    return alert('Preencha todos os campos obrigatórios!');
  }

  try {
    const url = produtoExistente
      ? `http://localhost:3000/produtos/${id}`
      : 'http://localhost:3000/produtos';

    const method = produtoExistente ? 'PUT' : 'POST';

    await fetchProdutos(url, method, dadosProduto);

    closeModal();
    carregarProdutos();
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro);
    alert('Não foi possível salvar o produto.');
  }
});

//DELETE
async function excluirProduto(id){

  if (!confirm("Deseja realmente excluir este item?")) return;

  try {
    const res = await fetch(`http://localhost:3000/produtos/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Produto excluído com sucesso!");
      carregarNotas();
    } else {
      alert("Erro ao excluir Produto.");
    }
  } catch (err) {
    console.error("Erro ao excluir Produto:", err);
  }
}


// xxxxxxxxxxxxxxxxxxxx PESQUISA xxxxxxxxxxxxxxxxxxxxxx
function pesquisarProdutos() {
  const termo = inputPesquisa.value.toLowerCase().trim();
  const filtrados = listaProdutos.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    (p.fornecedor && p.fornecedor.toLowerCase().includes(termo)) ||
    p.id.toString().includes(termo)
  );
  exibirProdutos(filtrados);
}

botaoPesquisa.addEventListener('click', pesquisarProdutos);
inputPesquisa.addEventListener('keyup', pesquisarProdutos);

carregarProdutos();
