const fs = require('fs');

 exports.mkdirPromise = (directory) => {
    return new Promise((resolve, reject) => {
        fs.mkdir('./' + directory, (err) => {
            if (err) reject(err);
            else resolve();
        })
    })
}

exports.writeFilePromise = (fileName, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, 'utf8', (err) => {
            if (err) reject(err);
            else resolve();
        })
    }) 
}