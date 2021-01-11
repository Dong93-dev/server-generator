const inquirer = require('inquirer');
const {mkdirPromise, writeFilePromise} = require('./fsPromise');

// index.js
const Q1 = {
    type: "list",
    name: "designPattern",
    choices: ['MVC'],
    message: 'Please choose the pattern of design',
    default: 'MVC'
};
const serverQuestion = {
    type: "list",
    name: 'serverType',
    choices: ['express'],
    message: 'Please choose a server package to start'
};

const dbQuestion = {
    type: "confirm",
    name: 'dbDesign',
    message: 'Please confirm if there is database design',
    default: true
}
const dbQueryQuestion = {
    type: 'list',
    name: 'sqlQueryBuilder',
    choices: ['knex', 'node-postgres'],
    message: 'Please choose the sqlQuery package',
    default: 'knex'
}

function generate(projectName) {
    return mkdirPromise(projectName)
    .then(() =>  inquirer.prompt(Q1))
    .then(answers => {
        if (answers['designPattern'] === 'MVC') {
            return Promise.all([mkdirPromise(projectName + '/controllers'), mkdirPromise(projectName + '/models')])
        }
    })
    .then(() => {
        return inquirer.prompt(serverQuestion)
    })
    .then((answers) => {
        if (answers.serverType === 'express') {
            const appText = `
const express = require('express');
\/\/const apiRouter = require('./routers/api.router.js')

const app = express();

app.use(express.json());

\/\/app.use('/api', apiRouter);

app.use('/*', (req, res, next){
    next({status: 404, msg: 'route not found'})
});

app.use(handleCustomErr);
app.use(handlePSQLErr);
app.use(handleServerErr);

module.exports = app;
`;
const listenerText = `const app = require('./app');
app.listen(8000, ()=>{
    console.log('the server is listening...')
})
            `;

            return [answers, writeFilePromise('./' + projectName + '/app.js', appText), writeFilePromise('./' + projectName + '/listener.js', listenerText), mkdirPromise(projectName + '/routers')]
        }
    }).then(([answers]) => {
        if (answers.serverType === 'express') {
            const apiRouterText = `
const apiRouter = require('express').Router();
\/\/const router_name = require('router_path')

\/\/apiRouter.use('/endpoint', router_name);
\/\/apiRouter.route('/')
\/\/         .get(controller_function_name)
\/\/         .post(controller_function_name);
module.exports = apiRouter;`
            return writeFilePromise('./' + projectName + '/routers/' + 'api.router.js', apiRouterText);
        }
    }).then(() => {
        return inquirer.prompt(dbQuestion)
    }).then((answers))
    
}

module.exports = generate;
