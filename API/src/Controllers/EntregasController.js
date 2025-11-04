const express = require("express");
const service = require("../Services/EntregasService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const entregas = service.listar();
    res.json(entregas);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const entrega = service.listar(id);

    if (!entrega)
        return res.status(404).send("Entrega não encontrada.");

    res.json(entrega);
});

//POST
router.post("/", (req, res) => {
  try {
    const novaEntrega = service.inserir(req.body);
    res.status(201).json(novaEntrega);
  } catch (error) {
    console.error("Erro ao inserir entrega:", error);
    res.status(500).send("Erro ao cadastrar entrega");
  }
});


//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const entregaAtualizada = service.atualizar(id, req.body);

    if (!entregaAtualizada)
        return res.status(404).send("Entrega não encontrada.");

    res.json(entregaAtualizada);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("Entrega não encontrada.");

    res.status(204).send();
});

module.exports = router;