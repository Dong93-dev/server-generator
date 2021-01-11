
const express = require('express');
//const apiRouter = require('./routers/api.router.js')

const app = express();

app.use(express.json());

//app.use('/api', apiRouter);

app.use('/*', (req, res, next){
    next({status: 404, msg: 'route not found'})
});

app.use(handleCustomErr);
app.use(handlePSQLErr);
app.use(handleServerErr);

module.exports = app;
