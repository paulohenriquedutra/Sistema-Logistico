const model = require("../Models/Entregas");

function listar(id = null) {
    const entregas = model.getAll();
    if (id != null)
        return entregas.find(e => e.id === id);
    else
        return entregas;
}

function inserir(entrega) {
    const entregas = model.getAll();

    const ids = entregas.map(entrega => entrega.id);
    const maiorId = ids.length > 0 ? Math.max(...ids) : 0;
    entrega.id = maiorId + 1;

    entregas.push(entrega);
    model.saveAll(entregas);
    return entrega;
}

function atualizar(id, novosDados) {
    const entregas = model.getAll();
    const index = entregas.findIndex(e => e.id === id);

    if (index === -1) return null;
    if (novosDados.id && novosDados.id !== id) return null;

    entregas[index] = { ...entregas[index], ...novosDados };
    entregas[index].id !== novosDados.id

    model.saveAll(entregas);
    return entregas[index];
}

function deletar(id) {
    let entregas = model.getAll();
    const tamanhoInicial = entregas.length;
    entregas = entregas.filter(e => e.id !== id);

    if (entregas.length === tamanhoInicial) return false;

    model.saveAll(entregas);
    return true;
}

module.exports = {
    listar,
    inserir,
    atualizar,
    deletar
};