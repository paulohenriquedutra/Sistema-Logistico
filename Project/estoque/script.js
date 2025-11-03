const corpoTabela = document.getElementById('corpo-tabela');
const produtoForm = document.getElementById('produtoForm');
const modal = document.getElementById('produtoModal');
const inputPesquisa = document.getElementById('pesquisa');
const botaoPesquisa = document.getElementById('botao-pesquisa');
const inputIdProduto = document.getElementById('IdProduto');

let listaProdutos = [];

function openModal() {
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');

  const novoId = listaProdutos.length > 0 
    ? Math.max(...listaProdutos.map(p => parseInt(p.id))) + 1 
    : 1;

  inputIdProduto.value = novoId.toString();
}

function closeModal() {
  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.classList.remove('opacity-100');
  produtoForm.reset();
}

async function carregarProdutos() {
  try {
    const resposta = await fetch('http://localhost:3000/produtos');
    if (!resposta.ok) throw new Error(`HTTP error! status: ${resposta.status}`);
    listaProdutos = await resposta.json();
    exibirProdutos(listaProdutos);
  } catch (erro) {
    console.error('Erro ao carregar produtos:', erro);
    corpoTabela.innerHTML = '<tr><td colspan="5" class="text-center py-2">Não foi possível carregar os produtos.</td></tr>';
  }
}

function exibirProdutos(produtos) {
  corpoTabela.innerHTML = '';

  if (produtos.length === 0) {
    corpoTabela.innerHTML = '<tr><td colspan="5" class="text-center py-2">Nenhum produto encontrado.</td></tr>';
    return;
  }

  produtos.forEach(p => {
    const tr = document.createElement('tr');
    tr.className = 'odd:bg-white even:bg-gray-50 hover:bg-gray-100';
    tr.innerHTML = `
      <td class="text-center px-4 py-2">${p.id}</td>
      <td class="text-center px-4 py-2">${p.nome}</td>
      <td class="text-center px-4 py-2">${p.quantidade}</td>
      <td class="text-center px-4 py-2">${p.localizacao || '-'}</td>
      <td class="text-center px-4 py-2">${p.fornecedor || '-'}</td>
    `;
    corpoTabela.appendChild(tr);
  });
}

produtoForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nomeProduto').value.trim();
  const quantidade = document.getElementById('quantidadeProduto').value.trim();
  const fornecedor = document.getElementById('fornecedorProduto').value.trim();

  if (!nome || !quantidade || !fornecedor) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }

  const novoProduto = {
    id: parseInt(inputIdProduto.value),
    nome,
    quantidade: parseInt(quantidade),
    localizacao: document.getElementById('localizacaoProduto').value.trim() || null,
    fornecedor
  };

  try {
    const resposta = await fetch('http://localhost:3000/produtos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    });

    const data = await resposta.json();
    if (resposta.ok && data.sucesso) {
      closeModal();
      carregarProdutos();
    } else {
      alert(data.mensagem || 'Erro ao adicionar produto');
    }
  } catch (erro) {
    console.error('Erro ao adicionar produto:', erro);
    alert('Não foi possível adicionar o produto. Verifique o servidor.');
  }
});

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
