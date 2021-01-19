exports.designPattern = {
  type: "list",
  name: "designPattern",
  choices: ["MVC"],
  message: "Please choose the pattern of design",
  default: "MVC",
};
exports.serverQuestion = {
  type: "list",
  name: "serverType",
  choices: ["express"],
  message: "Please choose a server package to start",
  default: "express",
};

exports.dbQuestion = {
  type: "list",
  name: "dbDesign",
  choices: ["PSQL", "none"],
  message: "Please confirm if there is database design",
  default: "PSQL",
};
exports.dbQueryQuestion = {
  type: "list",
  name: "sqlQueryBuilder",
  choices: ["knex", "node-postgres"],
  message: "Please choose the sqlQuery package",
  default: "knex",
};
