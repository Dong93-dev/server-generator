const fs = require("fs");
const { exec } = require("child_process");

exports.mkdirPromise = (directory) => {
  return new Promise((resolve, reject) => {
    fs.mkdir("./" + directory, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.writeFilePromise = (fileName, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, data, "utf8", (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

exports.readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

exports.execPromise = (cmd, directory) => {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: directory }, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
