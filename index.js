//impotar librerias de NODE
const fs = require("fs");
const path = require("path");

const indexModule = {};

//Lee el contenido del archivo 
const fileRead = (pathAbsolute) => {
  return new Promise((resolve, rejects) => {
    fs.readFile(pathAbsolute, "utf-8", (error, data) => {
      if (error) {
        rejects(error);
      }
      resolve(data);
    });
  });
};

// Encontrar los links del archivo
const getLinks = (file) => {
  //expresion regular para encontra los links
  const reg = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
  return file.matchAll(reg);
};

//Recibe ruta y verfica si es un archivo o directorio
const mdlinks = (dirpath) => {
  return new Promise((resolve, rejects) => {
    fs.stat(dirpath, (err, stats) => {
      if (err) {
        console.log(err)
      }
      //Verfica si es un archivo
      if (stats.isFile()) {
        //traer contenido de los archivos
        fileRead(dirpath)
          .then((data) => {
            let links = [];
            let index = 0;
            //Recorre todos los links y  almacena los datos como un array de objetos
            for (const url of getLinks(data)) {
              const obj = {
                
                href: url[2],
                text: url[1],
                file: dirpath,
              };
              //llenar array con el obj
              links[index] = obj;
              index++;
            }
            resolve(links);
          })

          .catch((err) => {
            rejects(err);
          });
      } else if (stats.isDirectory()) {
        const files = fs.readdirSync(dirpath);
        // console.log(files);
      
      }

    });
  });
};

indexModule.mdlinks = mdlinks;
module.exports = indexModule;


