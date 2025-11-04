const model = require("../Models/Entregadores");

function listar(id = null) {
    const entregadores = model.getAll();
    if (id != null)
        return entregadores.find(e => e.id === id);
    else
        return entregadores;
}

function inserir(entregador) {
    const entregadores = model.getAll();
    const ent = entregadores.find(e => e.id === entregador.id)

    if(ent.id == 0 || ent.id == null) {
        const ids = entregadores.map(entregador => entregador.id);
        const maiorId = Math.max.apply(null, ids);
        entregador.id = maiorId + 1;
    }
    
    entregadores.push(entregador);
    model.saveAll(entregadores);
    return entregador;
}

function atualizar(id, novosDados) {
    const entregadores = model.getAll();
    const index = entregadores.findIndex(e => e.id === id);

    if (index === -1) return null;
    if (novosDados.id && novosDados.id !== id) return null;

    entregadores[index] = { ...entregadores[index], ...novosDados };
    entregadores[index].id !== novosDados.id

    model.saveAll(entregadores);
    return entregadores[index];
}

function deletar(id) {
    let entregadores = model.getAll();
    const tamanhoInicial = entregadores.length;
    entregadores = entregadores.filter(e => e.id !== id);

    if (entregadores.length === tamanhoInicial) return false;

    model.saveAll(entregadores);
    return true;
}

module.exports = {
    listar,
    inserir,
    atualizar,
    deletar
};