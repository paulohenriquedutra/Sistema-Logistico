const express = require("express");
const port = 3000;

const usuariosController = require("./src/Controllers/UsuariosController");
const produtosController = require("./src/Controllers/ProdutosController");
const entregadoresController = require("./src/Controllers/EntregadoresController");
const entregasController = require("./src/Controllers/EntregasController");
const notasFiscaisController = require("./src/Controllers/NotasFiscaisController");

const app = express();
const cors = require('cors');

app.use(cors()); 
app.use(express.json());

app.use("/usuarios", usuariosController);
app.use("/produtos", produtosController);
app.use("/entregadores", entregadoresController);
app.use("/entregas", entregasController);
app.use("/notas-fiscais", notasFiscaisController);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
