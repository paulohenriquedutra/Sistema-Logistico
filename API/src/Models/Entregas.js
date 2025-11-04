const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../Data/Entregas.json");

function getAll() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

function saveAll(entregas) {
    fs.writeFileSync(filePath, JSON.stringify(entregas, null, 2));
}

module.exports = {
    getAll,
    saveAll
};