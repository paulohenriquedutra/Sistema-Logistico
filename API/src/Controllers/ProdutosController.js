const express = require("express");
const service = require("../Services/ProdutosService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const produtos = service.listar();
    res.json(produtos);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const produto = service.listar(id);

    if (!produto)
        return res.status(404).send("Produto não encontrado.");

    res.json(produto);
});

//POST
router.post("/", (req, res) => {
    if (!req.body.nome || !req.body.quantidade)
        return res.status(400).json({ sucesso: false, mensagem: "Campos obrigatórios ausentes." });

    try {
        const novoProduto = service.inserir(req.body);
        res.status(201).json({
            sucesso: true,
            mensagem: "Produto adicionado com sucesso!",
            produto: novoProduto
        });
    } catch (erro) {
        console.error("Erro ao inserir produto:", erro);
        res.status(500).json({ sucesso: false, mensagem: "Erro interno ao adicionar produto." });
    }
});

//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const produtoAtualizado = service.atualizar(id, req.body);

    if (!produtoAtualizado)
        return res.status(404).send("Produto não encontrado.");

    res.json(produtoAtualizado);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("Produto não encontrado.");

    res.status(204).send();
});

module.exports = router;