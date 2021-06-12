// modulos de node para trabajar con los archivos
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const mdlinks = {};
let array =[];

const isDirectory = (dirPath) => {
  let directory=fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
  if(directory){
    let filesList;
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, function (err, files) {
  
        if (err) {
          reject(err)
        } else {
          filesList = files.filter(function (e) {
            const file = path.join(dirPath, e);
            isDirectory(file)
            return path.extname(e).toLowerCase() === '.md'
          })
            console.log(array=array.concat(filesList))
        }
      })
    })
   }
  else{
    let extFile = path.extname(dirPath);
    if (extFile === ".md") {
      //console.log("es un archivo .md");
      return readMyfile(dirPath)
    }
  }
 
  
}


// leer un archivo
const readMyfile = (dirPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dirPath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        const regex = /(https?:\/\/[^\s)]+)[^,). ]/g;
        const newdata = data.toString()
        const matchData = newdata.match(regex);
                console.log(matchData);
        
      }

    })
  })

}

mdlinks.isDirectory = isDirectory;
//mdlinks.readMyfile = readMyfile;
module.exports = mdlinks;

// Funcion para filtrar si es un archivo o directorio

// const scanDirs = (dirPath) => {
  
//     let archivo = fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
//     //console.log(archivo)
//     if (archivo) {
//       return isDirectory(dirPath)

//     } else {
//       let extFile = path.extname(dirPath);
//       if (extFile === ".md") {
//         //console.log("es un archivo .md");
//        return readMyfile(dirPath)
//       }
//     }
// }