const {
  mkdirPromise,
  writeFilePromise,
  execPromise,
  readFilePromise,
} = require("./fsPromise");

exports.changePackageJson = (projectName, func) => {
  return readFilePromise(`./${projectName}/package.json`).then((data) => {
    const dataObj = JSON.parse(data);
    const newDataObj = func(dataObj);

    return writeFilePromise(
      `./${projectName}/package.json`,
      JSON.stringify(newDataObj, null, 2)
    );
  });
};

exports.createMVCfolders = (projectName) => {
  return Promise.all([
    mkdirPromise(projectName + "/controllers"),
    mkdirPromise(projectName + "/models"),
  ]).then(() => {
    setTimeout(() => {}, 1000);
    const exampleControllerFile = `
// import model functions here
const { exampleModelFunc } = require("../models/example.model.js")

exports.exampleControllerFunc = (req, res, next) => {
    exampleModelFunc();
}
`;

    const exampleModelFile = `
// import your db connection if any

const exampleModelFunc = () => {
    console.log("...")
}

module.exports = {exampleModelFunc}
`;
    return Promise.all([
      writeFilePromise(
        `${projectName}/controllers/example.controller.js`,
        exampleControllerFile
      ),
      writeFilePromise(
        `${projectName}/models/example.model.js`,
        exampleModelFile
      ),
    ]);
  });
};

exports.createExpressAppAndListener = (projectName) => {
  const appText = `
const express = require('express');
const apiRouter = require('./routers/api.router.js')

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res, next) => {
    next({status: 404, msg: 'route not found'})
});


app.use((err, req, res, next) => {
    // handle custom error
});
app.use((err, req, res, next) => {
    // handle sql/database error
});
app.use((err, req, res, next) => {
    // handle server error
});

module.exports = app;
`;
  const listenerText = `const app = require('./app');
app.listen(8000, ()=>{
    console.log('the server is listening...')
})
            `;
  return Promise.all([
    writeFilePromise("./" + projectName + "/app.js", appText),
    writeFilePromise("./" + projectName + "/listen.js", listenerText),
  ]);
};

exports.createExpressRouter = (projectName) => {
  const apiRouterText = `
const apiRouter = require('express').Router();
const { exampleControllerFunc } =require("../controllers/example.controller")
\/\/const router_name = require('router_path')
    
\/\/apiRouter.use('/endpoint', router_name);
apiRouter.route('/')
         .get(exampleControllerFunc);
         
module.exports = apiRouter;`;

  return writeFilePromise(
    "./" + projectName + "/routers/api.router.js",
    apiRouterText
  );
};

exports.databaseSetUp = (projectName) => {
  return mkdirPromise(`${projectName}/db`)
    .then(() => {
      setTimeout(() => {}, 1000);
      return Promise.all([
        mkdirPromise(`${projectName}/db/test_data`),
        mkdirPromise(`${projectName}/db/development_data`),
      ]);
    })
    .then(() => {
      setTimeout(() => {}, 1000);
      return Promise.all([
        writeFilePromise(
          `${projectName}/db/test_data/example_test.js`,
          `module.exports = [{id: 1}]`
        ),
        writeFilePromise(
          `${projectName}/db/development_data/example_dev.js`,
          `module.exports = [{id: 1}]`
        ),
      ]);
    })
    .then(() => {
      setTimeout(() => {}, 1000);
      return Promise.all([
        writeFilePromise(
          `${projectName}/db/test_data/index.js`,
          `exports.test_data = require("./example_test")`
        ),
        writeFilePromise(
          `${projectName}/db/development_data/index.js`,
          `exports.dev_data = require("./example_dev")`
        ),
        writeFilePromise(
          `${projectName}/db/index.js`,
          `const ENV = process.env.NODE_ENV || "development";
const testData = require("./test_data");
const devData = require("./development_data");
const data = {
  test: testData,
  development: devData,
};

module.exports = data[ENV];
`
        ),
      ]);
    })
    .then(() => {
      return mkdirPromise(`${projectName}/db/seeds`);
    });
};

exports.pgSetup = (projectName) => {
  const dbConfig = `
const ENV = process.env.NODE_ENV || "development";
// please make sure the following info is correct

const baseConfig = {
    port: "5432",
    // user:"",
    // password: "",
};

const customConfig = {
    development: {database: "example_db"},
    test: {database: "example_db_test"}
}

module.exports = {...baseConfig, ...customConfig[ENV]};
    `;
  const connectionFile = `
const {Client} = require("pg");
const dbConfig = require("./dbConfig");

const  client = new Client(dbConfig);

client.connect().then(() => {
    console.log('connected');
  });;

module.exports = client;
`;
  return execPromise("npm i pg -S", `./${projectName}`)
    .then(() => {
      return Promise.all([
        writeFilePromise(
          `${projectName}/db/seeds/seed.sql`,
          `/*create database and tables with data populated*/
DROP DATABASE IF EXISTS example_db;
CREATE DATABASE example_db;

\\c example_db;

CREATE TABLE example_table (
  id INT PRIMARY KEY
);

INSERT INTO example_table
(id)
VALUES
(1);
`
        ),
        writeFilePromise(
          `${projectName}/db/seeds/seed-test.sql`,
          `/*create database_test and tables with data populated*/
DROP DATABASE IF EXISTS example_db_test;
CREATE DATABASE example_db_test;

\\c example_db_test;

CREATE TABLE example_table (
  id INT PRIMARY KEY
);

INSERT INTO example_table
(id)
VALUES
(1);`
        ),
      ]);
    })
    .then(() => {
      return writeFilePromise(`${projectName}/db/dbConfig.js`, dbConfig);
    })
    .then(() => {
      return writeFilePromise(
        `${projectName}/db/connection.js`,
        connectionFile
      );
    })
    .then(() => {
      return this.changePackageJson(projectName, (obj) => {
        obj.scripts["seed_test"] = "psql -f ./db/seeds/seed-test.sql";
        obj.scripts.seed = "psql -f ./db/seeds/seed.sql";
        obj.scripts.start = "node listen.js";
        obj.scripts.test = "jest";
        return obj;
      });
    });
};

exports.knexSetup = (projectName) => {
  return execPromise("npm i knex pg -S", `./${projectName}`)
    .then(() => mkdirPromise(`${projectName}/db/migrations`))
    .then(() =>
      writeFilePromise(
        `${projectName}/db/seeds/seed.js`,
        `
const dbData = require("../index")

exports.seed = (knex) => {
  /*
   return knex.migrate
   .rollback()
   .then(() => knex.migrate.latest())
   .then(() => knex("example_table").insert(dbData[data]))
 */
}`
      )
    )
    .then(() => {
      const dbConfig = `
const ENV = process.env.NODE_ENV || "development";
// please make sure the following info is correct

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};

const customConfig = {
      development: {
        connection: {
          database: "",
          // user,
          // password
        },
      },
      test: {
        connection: {
          database: "",
          // user,
          // password
        },
      },
}

module.exports = {...baseConfig, ...customConfig[ENV]};
    `;
      const connectionFile = `
const knex = require("knex");
const dbConfig = require("../knexfile");

const connection = knex(dbConfig);


module.exports = connection;
`;

      return Promise.all([
        writeFilePromise(`${projectName}/knexfile.js`, dbConfig),
        writeFilePromise(`${projectName}/db/connection.js`, connectionFile),
      ]);
    })
    .then(() => {
      const dbSetup = `
/*
DROP DATABASE IF EXISTS databse_name;
CREATE DATABASE databse_name;

DROP DATABASE IF EXISTS databse_test_name;
CREATE DATABASE databse_test_name;
*/
        `;
      return writeFilePromise(`${projectName}/db/dbSetup.sql`, dbSetup);
    })
    .then(() => {
      return this.changePackageJson(projectName, (obj) => {
        obj.scripts = {
          "setup-dbs": "psql -f ./db/setup.sql",
          "seed-test": "NODE_ENV=test knex seed:run",
          "migrate-make": "knex migrate:make",
          "migrate-latest": "knex migrate:latest",
          "migrate-rollback": "knex migrate:rollback",
          "seed-dev": "knex seed:run",
          start: "node listen.js",
          test: "jest",
        };
        return obj;
      });
    });
};

exports.createGitIgnoreFile = (projectName) => {
  const ignore = `
node_modules
`;
  return writeFilePromise(`${projectName}/.gitignore`, ignore);
};
