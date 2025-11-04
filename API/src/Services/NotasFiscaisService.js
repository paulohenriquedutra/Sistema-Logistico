const model = require("../Models/NotasFiscais");

function listar(id = null) {
    const notasFiscais = model.getAll();
    if (id != null)
        return notasFiscais.find(n => n.id === id);
    else
        return notasFiscais;
}

function inserir(notaFiscal) {
    const notasFiscais = model.getAll();

    const ids = notasFiscais.map(n => n.id || 0);
    const novoId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

    notaFiscal.id = novoId;

    notasFiscais.push(notaFiscal);
    model.saveAll(notasFiscais);

    return notaFiscal;
}


function atualizar(id, novosDados) {
    const notasFiscais = model.getAll();
    const index = notasFiscais.findIndex(n => n.id === id);

    if (index === -1) return null;
    if (novosDados.id && novosDados.id !== id) return null;

    notasFiscais[index] = { ...notasFiscais[index], ...novosDados };
    notasFiscais[index].id !== novosDados.id

    model.saveAll(notasFiscais);
    return notasFiscais[index];
}

function deletar(id) {
    let notasFiscais = model.getAll();
    const tamanhoInicial = notasFiscais.length;
    notasFiscais = notasFiscais.filter(n => n.id !== id);

    if (notasFiscais.length === tamanhoInicial) return false;

    model.saveAll(notasFiscais);
    return true;
}

module.exports = {
    listar,
    inserir,
    atualizar,
    deletar
};