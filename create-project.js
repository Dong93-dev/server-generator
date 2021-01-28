const generate = require("./generate");
const nameOfProject = process.argv.slice(-1)[0];

generate(nameOfProject);
