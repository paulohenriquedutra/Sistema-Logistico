const express = require("express");
const service = require("../Services/EntregadoresService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const entregadores = service.listar();
    res.json(entregadores);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const entregador = service.listar(id);

    if (!entregador)
        return res.status(404).send("Entregador não encontrado.");

    res.json(entregador);
});

//POST
router.post("/", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id == null || req.body.id == '')
        return res.status(400).send("Campo ID não pode ser inserido");

    const novoEntregador = service.inserir(req.body);

    res.status(201).json(novoEntregador);
});

//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const entregadorAtualizado = service.atualizar(id, req.body);

    if (!entregadorAtualizado)
        return res.status(404).send("Entregador não encontrado.");

    res.json(entregadorAtualizado);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("Entregador não encontrado.");

    res.status(204).send();
});

module.exports = router;