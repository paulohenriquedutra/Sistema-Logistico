const express = require("express");
const service = require("../Services/UsuariosService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const usuarios = service.listar();
    res.json(usuarios);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = service.listar(id);

    if (!usuario)
        return res.status(404).send("Usuário não encontrado.");

    res.json(usuario);
});

//POST
router.post("/", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id == null || req.body.id == '' )
        return res.status(400).send("Campo ID não pode ser inserido");

    const novoUsuario = service.inserir(req.body);

    res.status(201).json(novoUsuario);
});

//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const usuarioAtualizado = service.atualizar(id, req.body);

    if (!usuarioAtualizado)
        return res.status(404).send("Usuário não encontrado.");

    res.json(usuarioAtualizado);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("Usuário não encontrado.");

    res.status(204).send();
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios." });
    }

    const usuario = service.buscarPorEmailESenha(email, senha);

    if (!usuario) {
        return res.status(401).json({ success: false, message: "Email ou senha inválidos." });
    }

    res.json({ success: true, user: usuario, token: "dummy-token" });
});

module.exports = router;
