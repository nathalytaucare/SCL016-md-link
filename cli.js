//librerias de node.js
const mdlinks = require('./index.js');
const pathLib = require('path')
//Toma datos de consola
const path = process.argv[2];
//Cambio de ruta relativa a absoluta
let dirPath = pathLib.resolve(path);

mdlinks.mdlinks(dirPath)
    .then(file => {
            console.log(file);
       })
    .catch(err => console.log('error', err));