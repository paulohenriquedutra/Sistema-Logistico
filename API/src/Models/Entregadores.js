const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../Data/Entregadores.json");

function getAll() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function saveAll(entregadores) {
    fs.writeFileSync(filePath, JSON.stringify(entregadores, null, 2));
}

module.exports = {
    getAll,
    saveAll
};