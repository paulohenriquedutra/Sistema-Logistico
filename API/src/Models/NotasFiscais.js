const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../Data/NotasFiscais.json");

function getAll() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function saveAll(notasFiscais) {
    fs.writeFileSync(filePath, JSON.stringify(notasFiscais, null, 2));
}

module.exports = {
    getAll,
    saveAll
};