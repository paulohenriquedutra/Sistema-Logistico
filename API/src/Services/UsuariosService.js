const model = require("../Models/Usuarios");

function listar(id = null) {
    const usuarios = model.getAll();
    if (id != null)
        return usuarios.find(u => u.id === id);
    else
        return usuarios;
}

function inserir(usuario) {
  const usuarios = model.getAll();
  const user = usuarios.find(u => u.id === usuario.id)

  if(user.id == 0 || user.id == null )
  {
    const ids = usuarios.map(usuario => usuario.id);
    const maiorId = Math.max.apply(null, ids);
    usuario.id = maiorId + 1;
  }
    
  usuarios.push(usuario);
  model.saveAll(usuarios);
  return usuario;
}

function atualizar(id, novosDados) {
    const usuarios = model.getAll();
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) return null;
    if (novosDados.id && novosDados.id !== id) return null;

    usuarios[index] = { ...usuarios[index], ...novosDados };
    usuarios[index].id !== novosDados.id

    model.saveAll(usuarios);
    return usuarios[index];
}

function deletar(id) {
  let usuarios = model.getAll();
  const tamanhoInicial = usuarios.length;
  usuarios = usuarios.filter(u => u.id !== id);

  if (usuarios.length === tamanhoInicial) return false;

  model.saveAll(usuarios);
  return true;
}
function buscarPorEmailESenha(email, senha) {
    const usuarios = listar(); 
    return usuarios.find(u => u.email === email && u.senha === senha);
}

function buscarPorEmailESenha(email, senha) {
    const usuarios = listar(); 
    return usuarios.find(u => u.email === email && u.senha === senha);
}

module.exports = {
    listar,
    inserir,
    atualizar,
    deletar,
    buscarPorEmailESenha
};

