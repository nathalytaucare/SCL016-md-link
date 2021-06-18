//impotar librerias de NODE
const fs = require("fs");
const path = require('path');
const fetch = require("node-fetch");

let totalLinks = 0;
let uniqueLinks = 0;
let brokenLinks = 0;

// LA ruta es un directorio o un archivo
const FileOrDirectory = (Path) => {
  const dirPath = path.resolve(Path).replace(/\\/g, "/");
  return new Promise((resolve, rejects) => {
    fs.stat(dirPath, (err, stats) => {
      if (err) {
        rejects(new Error("No es una ruta valida"))
      } else if (stats.isFile()) {
        resolve(readMdFiles(dirPath))
      } else if (stats.isDirectory()) {
        resolve(readDirectorys(dirPath))
      }
    });
  });
};
const readDirectorys = (dirPath) => {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(dirPath);
    let directoryContent = [];
    files.forEach((arch, i) => {
      directoryContent[i] = FileOrDirectory(dirPath + "/" + arch)
    });
    Promise.all(directoryContent)
      .then((resultado) => {
        return resultado.reduce((acc, val) => acc.concat(val), []);
      })
      .then((resu) => {
        resolve(resu.filter((val) => typeof val === "object"));
      })
      .catch((error) => {
        reject(error);
      });
  })

}


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
        rejects(new Error("Error al leer el archivo"))
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
        } else if (res.status === 404) {
          link.status = res.status;
          link.response = res.statusText;
          link.response = "FAIL";
          //console.log("LINK FAIL", link.response);
        }
      });
    });
    Promise.all(statusLinks)
      .then(res => {
        //console.log("VALIDATE:", links);
        resolve(links);
       
      }).catch(err => {
        links.status = null;
        links.response = "FAIL";
        resolve(links);
        //console.log("catch:", links);
      });
  });
};
//Estadisticas de TOTAL y UNIQUES
const statsOption = links => {
  return new Promise((resolve, reject) => {
    let allLinks = links.map(link => link.href);
    totalLinks += allLinks.length;
    uniqueLinks += [...new Set(allLinks)].length;
    let statsResult = {
      total: totalLinks,
      unique: uniqueLinks
    };
    resolve(statsResult);
  });
};

const statsValidateOption = (links) => {
  console.log("links",links);
  return new Promise((resolve, reject) => {
    validateOption(links).then(link => {
      let allLinks = link.map(link => link.href);
      let statusLinks = links.map(link => link.response);
      //console.log("statusLinks:", statusLinks);
      let totalLinks = allLinks.length;
      //console.log("totalLinks:", totalLinks);
      uniqueLinks = [...new Set(allLinks)];
      //console.log("uniqueLinks:", uniqueLinks);
      brokenLinks += (statusLinks.toString().match(/FAIL/g));
      //console.log("brokenLinks:", brokenLinks);
      let statsResult = {
        total: totalLinks,
        unique: uniqueLinks.length,
        broken: brokenLinks.length
      }
      //console.log("STATS RESULT 2:", statsResult);
      if (brokenLinks === 0) {
        statsResult = {
          total: totalLinks,
          unique: uniqueLinks.length,
          broken: 0
        }
        console.log("statsResult",statsResult);
        resolve(statsResult);
      } else {
        brokenLinks = (statusLinks.toString().match(/FAIL/g)).length;
        let statsResult = {
          total: totalLinks,
          unique: uniqueLinks.length,
          broken: brokenLinks
        }
        console.log("statsResult",statsResult);
        resolve(statsResult);
        //console.log("STATS RESULT:", statsResult);
      }
    }).catch(err => {
      reject(new Error("Error en la promesa"))
    })
  })
}


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
    } else if (options.validate === true && options.stats === false) {
      FileOrDirectory(dirPath).then(links => {
        validateOption(links).then(res => {
          resolve(res);
        })
      });
    } else if (options.validate === false && options.stats === true) {
      FileOrDirectory(dirPath).then(res => {
        statsOption(res).then(res => {
          resolve(res);
        });
      });
    } else if (options.validate === true && options.stats === true) {
      FileOrDirectory(dirPath).then(res => {
        statsValidateOption(res)
          .then(res => {
            resolve(res);
          });
      });
    }

  });
};

module.exports = {mdlinks,FileOrDirectory,fileRead,validateOption,statsOption,statsValidateOption};


