const fs = require("fs");

function removeProject(projectName) {
  return new Promise((resolve, reject) => {
    fs.rmdir(`./${projectName}`, { recursive: true }, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = removeProject;
