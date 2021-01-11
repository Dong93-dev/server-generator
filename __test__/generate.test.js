const generate = require('../generate');
const removeProject = require('./utils'); 
const fs = require('fs');
const { it } = require('@jest/globals');
describe('generate', () => {
    beforeEach(done => removeProject('test_project', done));
    it('return true if the directory was created', (done) => {
         generate('test_project').then(() => {
            fs.access('./test_project', (err) => {
                expect(err).toBe(null);
                done();
            })
        })
    })
    it('generated controller, modeller', (done) => {
        jest.setTimeout(10000);
        generate('test_project').then(()=>{
            fs.access('./test_project/controllers', (err) => {
                expect(err).toBe(null);
                done();
            })
        })
    })
    it('generated app.js', (done) => {
        jest.setTimeout(10000);
        generate('test_project').then(()=>{
            fs.access('./test_project/app.js', (err) => {
                expect(err).toBe(null);
                done();
            })
        })
    })
    it.only('generated router', (done) => {
        generate('test_project').then(()=>{
            fs.access('./test_project/routers', (err) => {
                expect(err).toBe(null);
                done();
            })
        })
    })

})