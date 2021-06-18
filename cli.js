//librerias de node.js
const {mdlinks} = require('./index.js');
const pathLib = require('path')
//Toma datos de consola
const path = process.argv[2];
let firstOption = process.argv[3];
let secondOption = process.argv[4];
//Cambio de ruta relativa a absoluta
let dirPath = pathLib.resolve(path);

let options = {
    validate: false,
    stats: false
};

if (
    (firstOption === "--validate" && secondOption === "--stats") ||
    (firstOption === "--stats" && secondOption === "--validate")
) {
    options.validate = true;
    options.stats = true;
} else if (firstOption === "--validate") {
    options.validate = true;
    options.stats = false;
} else if (firstOption === "--stats") {
    options.validate = false;
    options.stats = true;
} else {
    options.validate = false;
    options.stats = false;
}

mdlinks(dirPath,options)
    .then(file => {
        console.log(file);
    })
    .catch(err => console.log('error', err));