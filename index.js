//impotar librerias de NODE
const fs = require("fs");
const path = require('path');
const fetch = require("node-fetch");

const indexModule = {};

// LA ruta es un directorio o un archivo
const FileOrDirectory = (dirPath) => {
  return new Promise((resolve, rejects) => {
    fs.stat(dirPath, (err, stats) => {
      if (err) {
        rejects(err)
      } else if (stats.isFile()) {
        resolve(readMdFiles(dirPath))
      } else if (stats.isDirectory()) {
        resolve(readDirectorys(dirPath))
      }
    });
  });
};

const readMdFiles = (dirPath) => {
  let ext = path.extname(dirPath).toLowerCase()
  if (ext === '.md') {
    return fileRead(dirPath)
  }
}
// Encontrar los links del archivo
const getLinks = (file) => {
  //expresion regular para encontra los links
  const reg = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g;
  return file.matchAll(reg);
};

//Lee el contenido del archivo 
const fileRead = (dirPath) => {
  return new Promise((resolve, rejects) => {
    fs.readFile(dirPath, "utf-8", (error, data) => {
      if (error) {
        rejects(error);
      }
      let links = [];
      let index = 0;
      //Recorre todos los links y  almacena los datos como un array de objetos
      for (const url of getLinks(data)) {
        const obj = {
          href: url[2],
          text: url[1],
          file: dirPath,
        };
        //llenar array con el obj
        links[index] = obj;
        index++;
        //console.log(obj.href)
      }

      resolve(links);
    });
  });
};

//Validar los links con sus status
const validateOption = links => {
  //console.log("LINKS:", links);
  return new Promise((resolve, reject) => {
    let statusLinks = links.map(link => {
      // links.map(link => {
      return fetch(link.href).then(res => {
        if (res.status === 200) {
          link.status = res.status;
          link.response = "O.K.";
          //console.log("LINK O.K.", link.response);
        } else if(res.status === 404) {
          link.status = res.status;
          link.response = res.statusText;
          link.response = "FAIL";
          //console.log("LINK FAIL", link.response);
        }
      });
    });
    Promise.all(statusLinks).then(res => {
      resolve(links);
      //console.log("VALIDATE:", links);
    }).catch(err => {
      links.status = null;
      links.response = "FAIL";
      resolve(links);
      //console.log("catch:", links);
    });
  });
};


//Recibe ruta y verfica si es un archivo o directorio
const mdlinks = (dirPath, options) => {
  return new Promise((resolve, rejects) => {
    if (options.validate === false && options.stats === false) {
      FileOrDirectory(dirPath)
        .then(resp => {
          resolve(resp)
        })
        .catch(err => {
          rejects(err)
        })
    }else if(options.validate===true && options.stats === false){
      FileOrDirectory(dirPath).then(links => {
        validateOption(links).then(res => {
          resolve(res);
        });
      });

    }

  });
};

indexModule.mdlinks = mdlinks;
module.exports = indexModule;


