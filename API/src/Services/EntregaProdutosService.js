const model = require("../Models/EntregaProdutos");

function listar(id = null) {
    const entregaProdutos = model.getAll();
    if (id != null)
        return entregaProdutos.find(ep => ep.id === id);
    else
        return entregaProdutos;
}

function inserir(entregaProduto) {
    const entregaProdutos = model.getAll();
    const ep = entregaProdutos.find(e => e.id === entregaProduto.id)

    if(ep.id == 0 || ep.id == null) {
        const ids = entregaProdutos.map(entregaProduto => entregaProduto.id);
        const maiorId = Math.max.apply(null, ids);
        entregaProduto.id = maiorId + 1;
    }
    
    entregaProdutos.push(entregaProduto);
    model.saveAll(entregaProdutos);
    return entregaProduto;
}

function atualizar(id, novosDados) {
    const entregaProdutos = model.getAll();
    const index = entregaProdutos.findIndex(e => e.id === id);

    if (index === -1) return null;
    if (novosDados.id && novosDados.id !== id) return null;

    entregaProdutos[index] = { ...entregaProdutos[index], ...novosDados };
    entregaProdutos[index].id !== novosDados.id

    model.saveAll(entregaProdutos);
    return entregaProdutos[index];
}

function deletar(id) {
    let entregaProdutos = model.getAll();
    const tamanhoInicial = entregaProdutos.length;
    entregaProdutos = entregaProdutos.filter(e => e.id !== id);

    if (entregaProdutos.length === tamanhoInicial) return false;

    model.saveAll(entregaProdutos);
    return true;
}

module.exports = {
    listar,
    inserir,
    atualizar,
    deletar
};