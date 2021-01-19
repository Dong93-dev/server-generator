const inquirer = require("inquirer");
const { mkdirPromise, writeFilePromise, execPromise } = require("./fsPromise");
const {
  createMVCfolders,
  createExpressAppAndListener,
  createExpressRouter,
  databaseSetUp,
  pgSetup,
  knexSetup,
  createGitIgnoreFile,
} = require("./utils");
const {
  designPattern,
  serverQuestion,
  dbQuestion,
  dbQueryQuestion,
} = require("./question");
// index.js

function generate(projectName) {
  return mkdirPromise(projectName)
    .then(() => execPromise("npm init -y", `./${projectName}`))
    .then(() => inquirer.prompt(designPattern))
    .then((answers) => {
      if (answers["designPattern"] === "MVC") {
        return createMVCfolders(projectName);
      }
    })
    .then(() => {
      return inquirer.prompt(serverQuestion);
    })
    .then((answers) => {
      if (answers.serverType === "express") {
        return [
          answers,
          execPromise("npm i express -S", `./${projectName}`),
          createExpressAppAndListener(projectName),
          mkdirPromise(projectName + "/routers"),
        ];
      }
    })
    .then(([answers]) => {
      setTimeout(() => {}, 1000);
      if (answers.serverType === "express") {
        return createExpressRouter(projectName);
      }
    })
    .then(() => {
      return inquirer.prompt(dbQuestion);
    })
    .then((answers) => {
      if (answers.dbDesign === "PSQL") {
        return Promise.all([answers.dbDesign, databaseSetUp(projectName)]);
      } else return Promise.all([answers.dbDesign]);
    })
    .then(([db]) => {
      if (db !== "none") return inquirer.prompt(dbQueryQuestion);
      else return;
    })
    .then((answers) => {
      if (answers && answers.sqlQueryBuilder === "knex") {
        return knexSetup(projectName);
      } else if (answers && answers.sqlQueryBuilder === "node-postgres") {
        return pgSetup(projectName);
      } else return;
    })
    .then(() => {
      return createGitIgnoreFile(projectName);
    });
}

module.exports = generate;
