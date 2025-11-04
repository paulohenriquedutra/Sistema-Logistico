const express = require("express");
const service = require("../Services/EntregaProdutosService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const entregaProdutos = service.listar();
    res.json(entregaProdutos);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const entregaProduto = service.listar(id);

    if (!entregaProduto)
        return res.status(404).send("EntregaProduto não encontrado.");

    res.json(entregaProduto);
});

//POST
router.post("/", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id == null || req.body.id == '')
        return res.status(400).send("Campo ID não pode ser inserido");

    const novoEntregaProduto = service.inserir(req.body);

    res.status(201).json(novoEntregaProduto);
});

//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const entregaProdutoAtualizado = service.atualizar(id, req.body);

    if (!entregaProdutoAtualizado)
        return res.status(404).send("EntregaProduto não encontrado.");

    res.json(entregaProdutoAtualizado);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("EntregaProduto não encontrado.");

    res.status(204).send();
});

module.exports = router;