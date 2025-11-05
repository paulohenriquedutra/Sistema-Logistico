const model = require("../Models/Produtos");

function listar(id = null) {
  const produtos = model.getAll();
  if (id != null)
    return produtos.find(p => p.id === id);
  else
    return produtos;
}

function inserir(produto) {
  const produtos = model.getAll();

  const prodExistente = produtos.find(p => p.id === produto.id);

  if (!produto.id || prodExistente) {
    const ids = produtos.map(p => p.id);
    const maiorId = ids.length > 0 ? Math.max(...ids) : 0;
    produto.id = maiorId + 1;
  }

  const novoProduto = {
    id: produto.id,
    nome: produto.nome,
    quantidade: produto.quantidade,
    precoUnitario: produto.precoUnitario,
    localizacao: produto.localizacao || "",
    fornecedor: produto.fornecedor || "",
  };

  produtos.push(novoProduto);
  model.saveAll(produtos);

  return novoProduto;
}

function atualizar(id, novosDados) {
  const produtos = model.getAll();
  const index = produtos.findIndex(p => p.id === id);

  if (index === -1) return null;
  if (novosDados.id && novosDados.id !== id) return null;

  produtos[index] = { ...produtos[index], ...novosDados };
  model.saveAll(produtos);

  return produtos[index];
}

function deletar(id) {
  let produtos = model.getAll();
  const tamanhoInicial = produtos.length;
  produtos = produtos.filter(p => p.id !== id);

  if (produtos.length === tamanhoInicial) return false;

  model.saveAll(produtos);
  return true;
}

module.exports = {
  listar,
  inserir,
  atualizar,
  deletar
};
