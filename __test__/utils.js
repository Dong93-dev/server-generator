const fs = require('fs');

function removeProject(projectName, cb) {
  fs.rmdir(`./${projectName}`, { recursive: true }, err => {
    if (err) console.log(err);
    else console.log('project removed...');
    cb();
  });
}

module.exports = removeProject;
