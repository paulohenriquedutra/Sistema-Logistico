const express = require("express");
const service = require("../Services/NotasFiscaisService");

const router = express.Router();

//GET ALL
router.get("/", (req, res) => {
    const notasFiscais = service.listar();
    res.json(notasFiscais);
});

//GET
router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const notaFiscal = service.listar(id);

    if (!notaFiscal)
        return res.status(404).send("Nota Fiscal não encontrada.");

    res.json(notaFiscal);
});

//POST
router.post("/", (req, res) => {
    if (req.body.id != null && req.body.id !== '')
        return res.status(400).send("Campo ID não pode ser inserido");

    const novaNotaFiscal = service.inserir(req.body);
    res.status(201).json(novaNotaFiscal);
});


//PUT
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    if (req.body.id && req.body.id !== id)
        return res.status(400).send("O ID não pode ser alterado.");

    const notaFiscalAtualizada = service.atualizar(id, req.body);

    if (!notaFiscalAtualizada)
        return res.status(404).send("Nota Fiscal não encontrada.");

    res.json(notaFiscalAtualizada);
});

// DELETE
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const deletado = service.deletar(id);

    if (!deletado)
        return res.status(404).send("Nota Fiscal não encontrada.");

    res.status(204).send();
});

module.exports = router;